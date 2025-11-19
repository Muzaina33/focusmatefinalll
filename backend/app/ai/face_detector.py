"""
Face Detection Module using Mediapipe FaceMesh
"""
import mediapipe as mp
import cv2
import numpy as np
from typing import Optional

class FaceDetector:
    def __init__(self):
        """Initialize Mediapipe FaceMesh"""
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_face_mesh = mp.solutions.face_mesh
    
    def detect_face(self, frame: np.ndarray) -> Optional[dict]:
        """
        Detect facial landmarks in a frame
        
        Args:
            frame: BGR image from OpenCV
            
        Returns:
            Dictionary with landmarks or None if no face detected
        """
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return None
        
        # Get first face landmarks
        face_landmarks = results.multi_face_landmarks[0]
        
        # Extract key landmarks
        landmarks_dict = {
            'all_landmarks': face_landmarks.landmark,
            'left_eye': self._get_eye_landmarks(face_landmarks, 'left'),
            'right_eye': self._get_eye_landmarks(face_landmarks, 'right'),
            'nose': self._get_nose_landmarks(face_landmarks),
            'mouth': self._get_mouth_landmarks(face_landmarks)
        }
        
        return landmarks_dict
    
    def _get_eye_landmarks(self, face_landmarks, side: str) -> list:
        """Extract eye landmarks"""
        if side == 'left':
            # Left eye indices in Mediapipe FaceMesh
            indices = [33, 160, 158, 133, 153, 144]
        else:
            # Right eye indices
            indices = [362, 385, 387, 263, 373, 380]
        
        return [face_landmarks.landmark[i] for i in indices]
    
    def _get_nose_landmarks(self, face_landmarks) -> list:
        """Extract nose landmarks"""
        # Nose tip and bridge
        indices = [1, 4, 5, 6]
        return [face_landmarks.landmark[i] for i in indices]
    
    def _get_mouth_landmarks(self, face_landmarks) -> list:
        """Extract mouth landmarks"""
        # Mouth corners and center
        indices = [61, 291, 0, 17]
        return [face_landmarks.landmark[i] for i in indices]
    
    def close(self):
        """Clean up resources"""
        self.face_mesh.close()
