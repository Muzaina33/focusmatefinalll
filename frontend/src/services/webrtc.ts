import { Socket } from 'socket.io-client';

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream: MediaStream | null;
}

class WebRTCManager {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private userId: string | null = null;

  private iceServers = {
    iceServers: [
      // STUN servers
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      // TURN servers (no account needed)
      { urls: 'turn:relay.metered.ca:80' },
      { urls: 'turn:relay.metered.ca:443' },
      { urls: 'turn:relay.metered.ca:443?transport=tcp' },
    ],
  };

  async initialize(socket: Socket, sessionId: string, userId: string) {
    this.socket = socket;
    this.sessionId = sessionId;
    this.userId = userId;

    // Set up WebRTC signaling listeners
    this.setupSignalingListeners();
  }

  async getLocalStream(audio: boolean = true, video: boolean = true): Promise<MediaStream> {
    try {
      console.log('🎥 Requesting media access:', { audio, video });
      
      // Try with ideal constraints first
      const constraints = {
        audio,
        video: video ? {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user'
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Media access granted:', {
        audioTracks: this.localStream.getAudioTracks().length,
        videoTracks: this.localStream.getVideoTracks().length
      });
      
      return this.localStream;
    } catch (error: any) {
      console.error('❌ Error accessing media devices:', error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied. Please allow camera access and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is being used by another application. Please close other apps and try again.');
      } else {
        throw new Error(`Camera error: ${error.message}`);
      }
    }
  }

  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection(this.iceServers);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.emit('webrtc_ice_candidate', {
          target_id: peerId,
          session_id: this.sessionId,
          from_id: this.userId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log(`Received remote stream from ${peerId}`);
      const [remoteStream] = event.streams;
      const peerConnection = this.peerConnections.get(peerId);
      if (peerConnection) {
        peerConnection.stream = remoteStream;
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('remoteStreamReceived', {
          detail: { peerId, stream: remoteStream }
        }));
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log(`✅ WebRTC connection established with ${peerId}`);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.log(`❌ WebRTC connection failed with ${peerId}`);
        this.removePeerConnection(peerId);
      }
    };

    // Store peer connection
    this.peerConnections.set(peerId, {
      peerId,
      connection: pc,
      stream: null,
    });

    return pc;
  }

  async createOffer(peerId: string): Promise<void> {
    const pc = await this.createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (this.socket) {
      this.socket.emit('webrtc_offer', {
        target_id: peerId,
        session_id: this.sessionId,
        from_id: this.userId,
        offer: offer,
      });
    }
  }

  async handleOffer(fromId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const pc = await this.createPeerConnection(fromId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (this.socket) {
      this.socket.emit('webrtc_answer', {
        target_id: fromId,
        session_id: this.sessionId,
        from_id: this.userId,
        answer: answer,
      });
    }
  }

  async handleAnswer(fromId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(fromId);
    if (peerConnection) {
      await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleIceCandidate(fromId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(fromId);
    if (peerConnection) {
      await peerConnection.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private setupSignalingListeners() {
    if (!this.socket) return;

    this.socket.on('webrtc_offer', async (data: any) => {
      console.log(`📞 Received WebRTC offer from ${data.from_id}`);
      await this.handleOffer(data.from_id, data.offer);
    });

    this.socket.on('webrtc_answer', async (data: any) => {
      console.log(`📞 Received WebRTC answer from ${data.from_id}`);
      await this.handleAnswer(data.from_id, data.answer);
    });

    this.socket.on('webrtc_ice_candidate', async (data: any) => {
      console.log(`🧊 Received ICE candidate from ${data.from_id}`);
      await this.handleIceCandidate(data.from_id, data.candidate);
    });
  }

  getRemoteStream(peerId: string): MediaStream | null {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      console.log(`No peer connection found for ${peerId}`);
      return null;
    }

    // Return cached stream if available
    if (peerConnection.stream) {
      return peerConnection.stream;
    }

    // Try to construct stream from receivers
    const pc = peerConnection.connection;
    const receivers = pc.getReceivers();
    
    if (receivers.length === 0) {
      console.log(`No receivers found for ${peerId}`);
      return null;
    }

    const stream = new MediaStream();
    receivers.forEach((receiver) => {
      if (receiver.track && receiver.track.readyState === 'live') {
        stream.addTrack(receiver.track);
      }
    });

    if (stream.getTracks().length > 0) {
      peerConnection.stream = stream;
      return stream;
    }

    return null;
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  removePeerConnection(peerId: string) {
    const peerConnection = this.peerConnections.get(peerId);
    if (peerConnection) {
      peerConnection.connection.close();
      this.peerConnections.delete(peerId);
    }
  }

  getAllRemoteStreams(): Map<string, MediaStream> {
    const streams = new Map<string, MediaStream>();
    this.peerConnections.forEach((peerConnection, peerId) => {
      const stream = this.getRemoteStream(peerId);
      if (stream) {
        streams.set(peerId, stream);
      }
    });
    return streams;
  }

  getPeerConnectionState(peerId: string): string {
    const peerConnection = this.peerConnections.get(peerId);
    return peerConnection ? peerConnection.connection.connectionState : 'not-found';
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  cleanup() {
    // Close all peer connections
    this.peerConnections.forEach((pc) => {
      pc.connection.close();
    });
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }
}

export const webrtcManager = new WebRTCManager();
