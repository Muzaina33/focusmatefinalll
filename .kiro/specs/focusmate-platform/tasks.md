# Implementation Plan

- [x] 1. Set up project structure and development environment



  - Create root directory structure with frontend, backend, extension, and docker folders
  - Initialize frontend with Vite + React + TypeScript + Tailwind CSS
  - Initialize backend with FastAPI + SQLAlchemy + Python 3.10+
  - Set up package.json and requirements.txt with all dependencies
  - Create .gitignore and basic README.md
  - _Requirements: All_

- [x] 2. Implement database models and schema


  - Create SQLAlchemy models for Users, Rooms, RoomParticipants, AttentionSamples, StatusTimeline, TabSwitchEvents, ClassReports
  - Write database initialization script with table creation and indexes
  - Implement database connection utilities and session management
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [ ]* 2.1 Write property test for database persistence
  - **Property 7: Session creation persists to database**
  - **Validates: Requirements 3.5, 20.2**

- [ ]* 2.2 Write property test for attendance records
  - **Property 11: Student joining creates attendance record**
  - **Validates: Requirements 4.5**

- [x] 3. Implement authentication system



  - Create JWT token generation and validation utilities
  - Implement password hashing with bcrypt
  - Create User model CRUD operations
  - Build /auth/register endpoint with role selection
  - Build /auth/login endpoint with JWT response
  - Build /auth/me endpoint for current user info
  - Implement authentication middleware for protected routes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ]* 3.1 Write property test for user registration
  - **Property 1: User registration creates valid accounts**
  - **Validates: Requirements 1.1, 1.4, 2.1, 2.3**

- [ ]* 3.2 Write property test for valid authentication
  - **Property 2: Valid credentials authenticate successfully**
  - **Validates: Requirements 1.2, 2.2**

- [ ]* 3.3 Write property test for invalid credentials
  - **Property 3: Invalid credentials are rejected**
  - **Validates: Requirements 1.3**

- [ ]* 3.4 Write property test for token expiration
  - **Property 4: Expired tokens require re-authentication**
  - **Validates: Requirements 1.5**

- [x] 4. Build frontend authentication pages


  - Create LandingPage component with hero, logo, and CTA buttons
  - Create LoginPage component with email/password form and role selector
  - Create RegisterPage component with registration form
  - Implement AuthContext with Zustand for state management
  - Create ProtectedRoute component for route guarding
  - Set up React Router with authentication routes
  - Apply dark neon glassmorphism theme with Tailwind
  - Implement responsive layouts for mobile, tablet, desktop
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 18.1, 18.2, 18.3, 18.4, 18.5, 19.1, 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ]* 4.1 Write example test for landing page navigation
  - **Example 1: Landing page CTA navigation**
  - **Validates: Requirements 22.3**

- [x] 5. Implement room management backend



  - Create room code generation utility (6-character unique codes)
  - Build /room/create endpoint for teachers
  - Build /room/join endpoint for students
  - Build /room/leave endpoint
  - Build /room/{room_id}/students endpoint
  - Build /room/{room_id}/lockmode endpoint
  - Build DELETE /room/{room_id} endpoint for ending sessions
  - Implement Room and RoomParticipants CRUD operations
  - _Requirements: 3.1, 3.2, 3.5, 4.1, 4.4, 9.1_

- [ ]* 5.1 Write property test for unique room codes
  - **Property 6: Session creation generates unique room codes**
  - **Validates: Requirements 3.1**

- [ ]* 5.2 Write property test for valid room joining
  - **Property 8: Valid room codes allow joining**
  - **Validates: Requirements 4.1**

- [ ]* 5.3 Write property test for invalid room codes
  - **Property 10: Invalid room codes prevent joining**
  - **Validates: Requirements 4.4**

- [x] 6. Implement WebSocket infrastructure



  - Set up python-socketio server with FastAPI integration
  - Create WebSocket event handlers for join_session, leave_session, toggle_lockmode
  - Implement session room management (join/leave rooms)
  - Create WebSocket message broadcasting utilities
  - Implement connection authentication and validation
  - _Requirements: 3.3, 6.3, 6.4, 8.1, 8.3, 9.4, 15.3, 15.4, 21.1_

- [ ]* 6.1 Write property test for WebSocket message delivery
  - **Property 12: Real-time updates propagate via WebSocket**
  - **Validates: Requirements 6.1, 6.3, 11.3, 15.3, 15.4**

- [ ]* 6.2 Write property test for LockMode broadcast
  - **Property 16: LockMode broadcasts to all students**
  - **Validates: Requirements 8.1, 8.3**

- [x] 7. Build WebRTC signaling system

  - Implement WebSocket handlers for WebRTC signaling (offer, answer, ice-candidate)
  - Create peer connection management utilities
  - Build signaling message routing between peers
  - Implement connection cleanup on peer disconnect
  - _Requirements: 3.3, 4.2, 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ]* 7.1 Write property test for WebRTC signaling
  - **Property 38: WebRTC signaling exchanges ICE and SDP**
  - **Validates: Requirements 21.2**

- [ ]* 7.2 Write property test for peer disconnection
  - **Property 39: Peer disconnection triggers cleanup**
  - **Validates: Requirements 21.5**

- [x] 8. Implement AI Engine face detection module


  - Create FaceDetector class with Mediapipe FaceMesh initialization
  - Implement detect_face method to extract facial landmarks
  - Set up video frame preprocessing with OpenCV
  - Handle face detection failures gracefully
  - _Requirements: 14.1_

- [ ]* 8.1 Write property test for face detection
  - **Property 25: Face detection produces landmarks**
  - **Validates: Requirements 14.1**


- [x] 9. Implement AI Engine attention analysis module

  - Create AttentionAnalyzer class
  - Implement eye aspect ratio (EAR) calculation for drowsiness detection
  - Implement head pose estimation for looking away detection
  - Implement blink rate analysis for engagement
  - Create status classification logic (Present, Engaged, Looking Away, Drowsy)
  - Implement attention score computation (0-100 weighted formula)
  - _Requirements: 14.2, 14.5_

- [ ]* 9.1 Write property test for status classification
  - **Property 26: Facial analysis produces valid status**
  - **Validates: Requirements 14.2**

- [ ]* 9.2 Write property test for attention score bounds
  - **Property 29: Attention scores are bounded**
  - **Validates: Requirements 14.5**


- [ ] 10. Implement AI Engine absence detection
  - Create absence timer in StreamProcessor
  - Implement 2-second timeout for Absent status
  - Implement 10-second timeout for Left Class status
  - Handle face re-detection and timer reset
  - _Requirements: 14.3, 14.4_

- [ ]* 10.1 Write property test for absence detection
  - **Property 27: Absence detection after timeout**
  - **Validates: Requirements 14.3**

- [ ]* 10.2 Write property test for Left Class detection
  - **Property 28: Left Class detection after extended absence**
  - **Validates: Requirements 14.4**


- [ ] 11. Implement AI Engine WebSocket communication
  - Create WebSocket client for AI Engine to backend connection
  - Implement send_update method with attention score, status, timestamp
  - Include student_id and session_id in all messages
  - Handle WebSocket reconnection with exponential backoff
  - Implement error handling for connection failures
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ]* 11.1 Write property test for AI update format
  - **Property 30: AI updates include required fields**

  - **Validates: Requirements 15.1, 15.2**

- [x] 12. Build AI Engine main processing loop

  - Create StreamProcessor class with video capture
  - Implement frame processing pipeline (capture → detect → analyze → send)
  - Set up 30 FPS processing rate
  - Integrate FaceDetector, AttentionAnalyzer, and WebSocket client
  - Implement graceful shutdown and cleanup
  - _Requirements: 4.3, 14.1, 14.2, 14.3, 14.4, 14.5, 15.1_

- [ ]* 12.1 Write property test for AI monitoring activation
  - **Property 9: Student joining activates AI monitoring**
  - **Validates: Requirements 4.3**

- [x] 13. Implement attention data persistence backend

  - Create WebSocket handler for ai_update events
  - Store AttentionSample records in database with timestamps
  - Implement status change detection and StatusTimeline recording
  - Calculate duration_in_previous for status transitions
  - Broadcast attention updates to teacher and student via WebSocket
  - _Requirements: 6.1, 6.3, 6.4, 11.3, 15.5, 20.3, 20.4_

- [ ]* 13.1 Write property test for attention data persistence
  - **Property 20: Session end persists all data**
  - **Validates: Requirements 9.3, 15.5, 20.3, 20.4**

- [ ]* 13.2 Write property test for status timeline recording
  - **Property 37: Status changes are recorded in timeline**
  - **Validates: Requirements 20.4**

- [x] 14. Build frontend WebSocket client

  - Create WebSocket service with socket.io-client
  - Implement connection management with authentication
  - Create event listeners for all server events
  - Implement automatic reconnection logic
  - Create Zustand store for WebSocket state
  - _Requirements: 3.3, 6.3, 6.4, 8.1, 8.3, 9.4, 11.3_



- [ ] 15. Build frontend WebRTC manager
  - Create WebRTCManager class for peer connection management
  - Implement local media stream capture (camera/microphone)
  - Create peer connection creation and configuration
  - Implement ICE candidate handling
  - Implement offer/answer SDP exchange via signaling
  - Handle remote stream reception and display
  - Implement connection state monitoring
  - _Requirements: 3.3, 3.4, 4.2, 21.2, 21.3, 21.4, 21.5_

- [x] 16. Build Teacher Dashboard session creation


  - Create TeacherDashboard main component
  - Create SessionCreator component with create button
  - Display generated room code prominently
  - Implement teacher webcam preview
  - Call /room/create API endpoint
  - Initialize WebSocket connection on session creation
  - Apply responsive layout for mobile/tablet/desktop
  - _Requirements: 3.1, 3.2, 3.4, 5.1, 19.1_


- [ ] 17. Build Teacher Dashboard student grid
  - Create StudentGrid component with responsive CSS Grid
  - Implement dynamic grid sizing (1x1, 2x2, 3x3, 4x4 based on student count)
  - Create StudentTile component with video, name, metrics
  - Display attention percentage and status on each tile
  - Implement mobile-optimized scrolling grid
  - Handle viewport size changes and reflow
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.5, 19.2_

- [ ]* 17.1 Write property test for independent student metrics
  - **Property 13: Multiple students have independent metrics**
  - **Validates: Requirements 6.5**


- [ ] 18. Implement teacher controls on student tiles
  - Add mute button to StudentTile with WebSocket command
  - Add camera off button with WebSocket command
  - Add kick button with confirmation dialog
  - Implement WebSocket handlers for mute_student, camera_off_student, kick_student
  - Store kick events in database with timestamps
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 18.1 Write property test for teacher controls
  - **Property 14: Teacher controls affect target students**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ]* 18.2 Write property test for kick event persistence
  - **Property 15: Kick events are persisted**

  - **Validates: Requirements 7.5**

- [ ] 19. Build Teacher Dashboard LockMode toggle
  - Create LockModeToggle component with switch UI
  - Implement toggle handler that calls /room/{room_id}/lockmode endpoint
  - Display current LockMode state visually
  - Broadcast LockMode changes via WebSocket

  - Apply neon glow effect when LockMode is active
  - _Requirements: 8.1, 8.3, 8.4_

- [ ] 20. Build Teacher Dashboard live activity feed
  - Create LiveActivityFeed component
  - Display real-time events (student joined, left, status changes, tab switches)
  - Implement auto-scroll to latest events

  - Apply glassmorphism styling
  - Make feed swipe-friendly on mobile
  - _Requirements: 19.4_

- [ ] 21. Build Teacher Dashboard session analytics
  - Create SessionAnalytics component

  - Display live metrics: student count, average attention, session duration
  - Update metrics in real-time from WebSocket events
  - Apply responsive layout
  - _Requirements: 6.5_

- [ ] 22. Implement session end functionality
  - Add "End Session" button to Teacher Dashboard
  - Implement end session handler that calls DELETE /room/{room_id}
  - Terminate all WebRTC connections
  - Disconnect all students via WebSocket
  - Generate and store ClassReport in database
  - Redirect teacher to reports page
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 22.1 Write property test for session end cleanup
  - **Property 18: Session end triggers cleanup**
  - **Validates: Requirements 9.1, 9.4**

- [ ]* 22.2 Write property test for report generation
  - **Property 19: Session end generates complete report**
  - **Validates: Requirements 9.2, 9.5, 10.2**

- [x] 23. Build Student Classroom join interface

  - Create StudentClassroom main component
  - Create room code input form
  - Call /room/join API endpoint
  - Initialize WebSocket connection
  - Start local media capture
  - Establish WebRTC connections with teacher and peers
  - Display error for invalid room codes
  - _Requirements: 4.1, 4.2, 4.4_


- [ ] 24. Build Student Classroom video display
  - Create VideoGrid component for teacher and peer videos
  - Display teacher webcam prominently
  - Display other student webcams in grid
  - Implement responsive grid layout
  - Handle dynamic peer additions and removals
  - _Requirements: 4.2, 5.2, 19.2_


- [ ] 25. Build Student Classroom attention panel
  - Create AttentionPanel component for right side
  - Display large attention percentage
  - Display current status text with color coding
  - Create mini line graph with Chart.js showing attention over time
  - Update metrics in real-time from WebSocket
  - Make panel swipe-friendly on mobile

  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 19.4_

- [ ] 26. Build Student Classroom bottom toolbar
  - Create BottomToolbar component with fixed positioning
  - Add camera toggle button
  - Add microphone toggle button
  - Add leave class button
  - Display LockMode indicator
  - Optimize button sizing for mobile touch (minimum 44px)
  - Implement control handlers that update WebRTC streams
  - _Requirements: 8.5, 12.1, 12.2, 12.3, 12.4, 12.5, 19.3_

- [x] 27. Implement reporting backend endpoints

  - Build GET /reports/teacher/{teacher_id}/sessions endpoint
  - Build GET /reports/session/{session_id} endpoint with full details
  - Build GET /reports/student/{student_id}/sessions endpoint
  - Build GET /reports/student/{student_id}/session/{session_id} endpoint
  - Implement report data aggregation queries
  - Calculate final attention scores and statistics
  - _Requirements: 2.4, 10.1, 10.2, 13.1, 13.2_

- [ ]* 27.1 Write property test for teacher reports
  - **Property 21: Teacher reports show all past sessions**
  - **Validates: Requirements 10.1**

- [ ]* 27.2 Write property test for student report access
  - **Property 5: Students can access their own reports**
  - **Validates: Requirements 2.4, 13.1**

- [ ]* 27.3 Write property test for complete session data
  - **Property 24: Student reports show complete session data**
  - **Validates: Requirements 13.2**

- [ ]* 27.4 Write property test for status timeline completeness
  - **Property 23: Status timelines include all transitions**
  - **Validates: Requirements 10.5, 13.5**


- [ ] 28. Implement report export functionality
  - Create CSV export utility for session reports
  - Create PDF export utility using reportlab or similar
  - Build POST /reports/export/csv endpoint
  - Build POST /reports/export/pdf endpoint
  - Include all session data in exports (attention, status, tab switches)
  - _Requirements: 10.3, 10.4, 13.3, 13.4_

- [ ]* 28.1 Write property test for export completeness
  - **Property 22: Reports export with complete data**
  - **Validates: Requirements 10.4, 13.4**


- [ ] 29. Build Teacher Reports page
  - Create TeacherReports component
  - Display list of past sessions with dates and summary metrics
  - Implement session list item click handler
  - Create SessionReportDetail component
  - Display detailed report with attention timeline, final scores, status transitions
  - Show tab switch counts for each student
  - Add export buttons for CSV and PDF
  - Apply responsive layout

  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 30. Build Student Reports page
  - Create StudentReports component accessible from "My Reports" link
  - Display list of attended sessions
  - Implement session click handler
  - Create StudentReportDetail component
  - Display final attention score, status timeline, attendance duration
  - Show tab switch events with timestamps
  - Add PDF export button
  - Apply responsive layout
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 31. Create browser extension manifest and structure

  - Create extension folder with manifest.json (Manifest V3)
  - Request permissions: tabs, activeTab, scripting
  - Define background service worker
  - Create popup.html and popup.js
  - Create content script for classroom page
  - Set up extension icons and branding
  - _Requirements: 17.5_

- [x] 32. Implement extension background service worker

  - Create background.js with tab event listeners
  - Implement tab switch detection (onActivated, onUpdated)
  - Create WebSocket connection to backend
  - Implement LockMode state management
  - Store classroom tab ID when student joins session
  - _Requirements: 16.1, 17.1, 17.2_

- [ ]* 32.1 Write property test for tab switch detection
  - **Property 31: Tab switches are detected**
  - **Validates: Requirements 16.1**


- [ ] 33. Implement extension LockMode enforcement
  - Implement tab switch blocking when LockMode is enabled
  - Auto-refocus classroom tab when switch is attempted
  - Send tab switch notification to backend via WebSocket
  - Log tab switch events with LockMode state
  - Only enforce on classroom URL
  - _Requirements: 8.2, 16.2, 16.3, 16.4, 17.4_

- [ ]* 33.1 Write property test for LockMode blocking
  - **Property 17: LockMode prevents tab switching**
  - **Validates: Requirements 8.2, 16.3**

- [ ]* 33.2 Write property test for tab switch notifications
  - **Property 32: Tab switches trigger notifications**
  - **Validates: Requirements 16.2**

- [ ]* 33.3 Write property test for tab switch logging
  - **Property 33: Tab switches logged when LockMode disabled**
  - **Validates: Requirements 16.4**

- [ ]* 33.4 Write property test for tab switch persistence
  - **Property 34: Tab switch events are persisted**
  - **Validates: Requirements 16.5, 20.5**

- [ ]* 33.5 Write property test for LockMode URL filtering
  - **Property 36: LockMode only applies to classroom URLs**
  - **Validates: Requirements 17.4**


- [ ] 34. Build extension popup UI
  - Create popup.html with FocusMate branding
  - Display current LockMode state (enabled/disabled)
  - Show informational text that teacher controls LockMode
  - Prevent student from toggling LockMode
  - Update popup in real-time when LockMode changes
  - Apply dark neon theme styling
  - _Requirements: 17.1, 17.2, 17.3_

- [ ]* 34.1 Write property test for student LockMode restrictions
  - **Property 35: Students cannot toggle LockMode**

  - **Validates: Requirements 17.3**

- [ ] 35. Implement backend tab switch event handling
  - Create WebSocket handler for tab_switch events from extension
  - Store TabSwitchEvent records in database
  - Include timestamp, lock_mode_active, was_blocked fields
  - Broadcast tab switch events to teacher dashboard
  - _Requirements: 16.5, 20.5_

- [x] 36. Apply premium dark UI theme globally

  - Create Tailwind theme configuration with neon cyan (#00e6ff)
  - Implement dark background colors across all pages
  - Apply glassmorphism effects to cards and panels
  - Add neon glow effects on hover and focus states
  - Create FocusMate logo component (scholar hat + F)
  - Ensure consistent branding across all components
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_


- [ ] 37. Implement comprehensive responsive design
  - Define breakpoints in Tailwind config (mobile, tablet, desktop)
  - Apply responsive classes to all layouts
  - Test video grid scaling on all screen sizes
  - Optimize bottom toolbar for mobile touch
  - Make right panels swipe-friendly with touch gestures
  - Test orientation changes (portrait/landscape)
  - Ensure all interactive elements meet 44px minimum touch target
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_


- [ ] 38. Create Docker configuration
  - Write Dockerfile for frontend (Node + Nginx)
  - Write Dockerfile for backend (Python 3.10)
  - Write Dockerfile for AI Engine (Python 3.10 + OpenCV)
  - Create docker-compose.yml with all services
  - Configure environment variables
  - Set up volume mounts for database persistence
  - Configure networking between containers

  - _Requirements: All_

- [ ] 39. Write comprehensive README documentation
  - Document project overview and features
  - Provide installation instructions
  - Document development setup for frontend, backend, AI engine
  - Provide Docker deployment instructions
  - Document API endpoints
  - Document WebSocket events
  - Include browser extension installation guide

  - Add troubleshooting section
  - _Requirements: All_

- [x] 40. Final checkpoint - Ensure all tests pass

  - Run all unit tests
  - Run all property-based tests
  - Fix any failing tests
  - Verify all features work end-to-end
  - Test on multiple browsers
  - Test on mobile devices
  - Ask the user if questions arise
