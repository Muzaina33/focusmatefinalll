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
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
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
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio,
        video: video ? { width: 1280, height: 720 } : false,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
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

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
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
      await this.handleOffer(data.from_id, data.offer);
    });

    this.socket.on('webrtc_answer', async (data: any) => {
      await this.handleAnswer(data.from_id, data.answer);
    });

    this.socket.on('webrtc_ice_candidate', async (data: any) => {
      await this.handleIceCandidate(data.from_id, data.candidate);
    });
  }

  getRemoteStream(peerId: string): MediaStream | null {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return null;

    const pc = peerConnection.connection;
    const receivers = pc.getReceivers();
    const stream = new MediaStream();
    
    receivers.forEach((receiver) => {
      if (receiver.track) {
        stream.addTrack(receiver.track);
      }
    });

    peerConnection.stream = stream;
    return stream;
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
