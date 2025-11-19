"""
Attention Analysis Module
Analyzes facial features to determine engagement status and attention score
"""
import numpy as np
from typing import Tuple

class AttentionAnalyzer:
    def __init__(self):
        """Initialize attention analyzer"""
        self.blink_counter = 0
        self.blink_history = []
        self.max_history = 30  # Track last 30 frames (1 second at 30fps)
    
    def analyze_engagement(self, landmarks: dict) -> Tuple[float, str]:
        """
        Analyze engagement from facial landmarks
        
        Args:
            landmarks: Dictionary containing facial landmarks
            
        Returns:
            Tuple of (attention_score, status)
        """
        # Calculate individual metrics
        ear = self._calculate_eye_aspect_ratio(landmarks)
        head_pose = self._estimate_head_pose(landmarks)
        blink_rate = self._analyze_blink_rate(ear)
        
        # Determine status based on metrics
        status = self._classify_status(ear, head_pose, blink_rate)
        
        # Calculate attention score
        attention_score = self.compute_attention_score({
            'ear': ear,
            'head_pose': head_pose,
            'blink_rate': blink_rate,
            'status': status
        })
        
        return attention_score, status
    
    def _calculate_eye_aspect_ratio(self, landmarks: dict) -> float:
        """
        Calculate Eye Aspect Ratio (EAR) for drowsiness detection
        EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
        """
        left_eye = landmarks['left_eye']
        right_eye = landmarks['right_eye']
        
        def eye_aspect_ratio(eye_points):
            # Vertical distances
            v1 = np.linalg.norm(np.array([eye_points[1].x, eye_points[1].y]) - 
                               np.array([eye_points[5].x, eye_points[5].y]))
            v2 = np.linalg.norm(np.array([eye_points[2].x, eye_points[2].y]) - 
                               np.array([eye_points[4].x, eye_points[4].y]))
            # Horizontal distance
            h = np.linalg.norm(np.array([eye_points[0].x, eye_points[0].y]) - 
                              np.array([eye_points[3].x, eye_points[3].y]))
            
            return (v1 + v2) / (2.0 * h) if h > 0 else 0
        
        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)
        
        return (left_ear + right_ear) / 2.0
    
    def _estimate_head_pose(self, landmarks: dict) -> float:
        """
        Estimate head pose angle (looking away detection)
        Returns angle in degrees (0 = facing forward, >30 = looking away)
        """
        nose = landmarks['nose']
        
        # Simple estimation based on nose position relative to face center
        # In a real implementation, this would use more sophisticated 3D pose estimation
        nose_x = nose[0].x
        
        # Nose should be around 0.5 when facing forward
        # Deviation indicates head turn
        deviation = abs(nose_x - 0.5)
        angle = deviation * 180  # Convert to approximate degrees
        
        return angle
    
    def _analyze_blink_rate(self, ear: float) -> float:
        """
        Analyze blink rate for engagement
        Normal blink rate: 15-20 blinks per minute
        """
        # EAR threshold for blink detection
        EAR_THRESHOLD = 0.2
        
        # Detect blink
        if ear < EAR_THRESHOLD:
            self.blink_counter += 1
        
        # Track blink history
        self.blink_history.append(1 if ear < EAR_THRESHOLD else 0)
        if len(self.blink_history) > self.max_history:
            self.blink_history.pop(0)
        
        # Calculate blinks per minute
        blinks_in_window = sum(self.blink_history)
        blinks_per_minute = (blinks_in_window / len(self.blink_history)) * 30 * 60
        
        return blinks_per_minute
    
    def _classify_status(self, ear: float, head_pose: float, blink_rate: float) -> str:
        """
        Classify engagement status based on metrics
        
        Statuses:
        - Engaged: High attention, eyes open, facing forward
        - Present: Face detected, neutral engagement
        - Looking Away: Head turned significantly
        - Drowsy: Low eye aspect ratio, slow blink rate
        """
        # Drowsy: Very low EAR or very slow blink rate
        if ear < 0.15 or blink_rate < 5:
            return 'Drowsy'
        
        # Looking Away: Head pose angle > 30 degrees
        if head_pose > 30:
            return 'Looking Away'
        
        # Engaged: Good EAR, normal blink rate, facing forward
        if ear > 0.25 and 10 < blink_rate < 30 and head_pose < 15:
            return 'Engaged'
        
        # Default: Present
        return 'Present'
    
    def compute_attention_score(self, metrics: dict) -> float:
        """
        Compute attention score (0-100) based on weighted metrics
        
        Weights:
        - Status: 40%
        - Eye Aspect Ratio: 30%
        - Head Pose: 20%
        - Blink Rate: 10%
        """
        status = metrics['status']
        ear = metrics['ear']
        head_pose = metrics['head_pose']
        blink_rate = metrics['blink_rate']
        
        # Status score
        status_scores = {
            'Engaged': 100,
            'Present': 70,
            'Looking Away': 40,
            'Drowsy': 20
        }
        status_score = status_scores.get(status, 50)
        
        # EAR score (normalized)
        ear_score = min(100, max(0, (ear / 0.3) * 100))
        
        # Head pose score (inverse - lower angle is better)
        head_pose_score = max(0, 100 - (head_pose * 2))
        
        # Blink rate score (optimal range: 15-20 bpm)
        if 15 <= blink_rate <= 20:
            blink_score = 100
        else:
            blink_score = max(0, 100 - abs(blink_rate - 17.5) * 5)
        
        # Weighted average
        attention_score = (
            status_score * 0.4 +
            ear_score * 0.3 +
            head_pose_score * 0.2 +
            blink_score * 0.1
        )
        
        # Ensure score is between 0 and 100
        return max(0.0, min(100.0, attention_score))
