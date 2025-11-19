# Requirements Document

## Introduction

FocusMate is a full-stack real-time virtual classroom platform that integrates AI-based attention monitoring with a LockMode system to enhance student engagement and provide comprehensive analytics. The system enables teachers to conduct live video sessions while monitoring student attention in real-time, and provides detailed reporting for both teachers and students. The platform includes a web application (frontend and backend), an AI monitoring engine, and a browser extension for enforcing focus.

## Glossary

- **FocusMate System**: The complete virtual classroom platform including frontend, backend, AI engine, database, and browser extension
- **Teacher Dashboard**: The web interface used by teachers to create sessions, monitor students, and view reports
- **Student Classroom**: The web interface used by students to join sessions and view their own attention metrics
- **AI Engine**: The Python-based attention monitoring system using Mediapipe and OpenCV
- **LockMode**: A feature that prevents students from switching browser tabs during class sessions
- **Attention Score**: A numerical value (0-100) representing student engagement level
- **Session**: A single classroom instance with a unique room code
- **Status**: The current engagement state of a student (Present, Engaged, Looking Away, Drowsy, Absent, Left Class)
- **WebRTC**: Web Real-Time Communication protocol for peer-to-peer video streaming
- **Browser Extension**: A Manifest V3 Chrome extension that enforces LockMode
- **Tab Switch Event**: An occurrence when a student navigates away from the classroom tab
- **Attention Sample**: A timestamped data point containing attention score and status
- **Class Report**: A comprehensive summary of a session including all student metrics

## Requirements

### Requirement 1

**User Story:** As a teacher, I want to register and login to the system, so that I can access the teacher dashboard and create classroom sessions.

#### Acceptance Criteria

1. WHEN a user submits registration with email, password, and teacher role THEN the FocusMate System SHALL create a new teacher account with JWT authentication
2. WHEN a registered teacher submits valid login credentials THEN the FocusMate System SHALL authenticate the user and redirect to the Teacher Dashboard
3. WHEN a user submits invalid credentials THEN the FocusMate System SHALL display an error message and prevent access
4. WHEN a teacher account is created THEN the FocusMate System SHALL store the user record in the database with role designation
5. WHEN authentication tokens expire THEN the FocusMate System SHALL require re-authentication before allowing protected actions

### Requirement 2

**User Story:** As a student, I want to register and login to the system, so that I can join classroom sessions and view my attention reports.

#### Acceptance Criteria

1. WHEN a user submits registration with email, password, and student role THEN the FocusMate System SHALL create a new student account with JWT authentication
2. WHEN a registered student submits valid login credentials THEN the FocusMate System SHALL authenticate the user and redirect to the Student Classroom interface
3. WHEN a student account is created THEN the FocusMate System SHALL store the user record in the database with role designation
4. WHEN a student logs in THEN the FocusMate System SHALL provide access to personal attention reports

### Requirement 3

**User Story:** As a teacher, I want to create a classroom session with a unique room code, so that students can join my virtual classroom.

#### Acceptance Criteria

1. WHEN a teacher clicks create session THEN the FocusMate System SHALL generate a unique room code and create a new session record
2. WHEN a session is created THEN the FocusMate System SHALL display the room code to the teacher for sharing with students
3. WHEN a session is created THEN the FocusMate System SHALL initialize WebRTC signaling for video communication
4. WHEN a session is created THEN the FocusMate System SHALL activate the teacher webcam preview
5. WHEN a session is active THEN the FocusMate System SHALL persist the session state in the database

### Requirement 4

**User Story:** As a student, I want to join a classroom session using a room code, so that I can participate in the virtual class.

#### Acceptance Criteria

1. WHEN a student enters a valid room code THEN the FocusMate System SHALL add the student to the session and establish video connection
2. WHEN a student joins a session THEN the FocusMate System SHALL display the teacher webcam and other student webcams
3. WHEN a student joins a session THEN the FocusMate System SHALL activate the AI Engine for attention monitoring
4. WHEN a student enters an invalid room code THEN the FocusMate System SHALL display an error message and prevent joining
5. WHEN a student joins THEN the FocusMate System SHALL create an initial attendance record with timestamp

### Requirement 5

**User Story:** As a teacher, I want to see real-time video feeds of all students in a responsive grid layout, so that I can monitor the classroom visually across all devices.

#### Acceptance Criteria

1. WHEN students join the session THEN the FocusMate System SHALL display student video tiles in a responsive grid layout
2. WHEN the viewport size changes THEN the FocusMate System SHALL adapt the video grid to maintain optimal viewing on mobile, tablet, and desktop devices
3. WHEN displaying student tiles THEN the FocusMate System SHALL show student name, video feed, attention percentage, and current status
4. WHEN the number of students changes THEN the FocusMate System SHALL dynamically adjust the grid layout
5. WHEN viewing on mobile devices THEN the FocusMate System SHALL optimize the grid for vertical scrolling and touch interaction

### Requirement 6

**User Story:** As a teacher, I want to see real-time attention metrics for each student, so that I can identify who needs support during the class.

#### Acceptance Criteria

1. WHEN the AI Engine detects student status THEN the FocusMate System SHALL display the current status (Present, Engaged, Looking Away, Drowsy, Absent, Left Class) on the student tile
2. WHEN the AI Engine computes attention score THEN the FocusMate System SHALL display the percentage (0-100) on the student tile
3. WHEN student status changes THEN the FocusMate System SHALL update the display in real-time via WebSocket
4. WHEN attention score changes THEN the FocusMate System SHALL update the percentage display in real-time via WebSocket
5. WHEN multiple students are present THEN the FocusMate System SHALL display individual metrics for each student simultaneously

### Requirement 7

**User Story:** As a teacher, I want to control individual student audio and video, so that I can manage classroom disruptions.

#### Acceptance Criteria

1. WHEN a teacher clicks the mute button on a student tile THEN the FocusMate System SHALL disable that student's audio transmission
2. WHEN a teacher clicks the camera off button on a student tile THEN the FocusMate System SHALL disable that student's video transmission
3. WHEN a teacher clicks the kick button on a student tile THEN the FocusMate System SHALL remove the student from the session
4. WHEN a control action is performed THEN the FocusMate System SHALL send the command via WebSocket to the target student
5. WHEN a student is kicked THEN the FocusMate System SHALL record the event with timestamp in the database

### Requirement 8

**User Story:** As a teacher, I want to toggle LockMode for the entire class, so that I can prevent students from switching tabs during important lessons.

#### Acceptance Criteria

1. WHEN a teacher enables LockMode THEN the FocusMate System SHALL broadcast the LockMode state to all connected students via WebSocket
2. WHEN LockMode is enabled THEN the Browser Extension SHALL prevent tab switching and auto-refocus the classroom tab
3. WHEN a teacher disables LockMode THEN the FocusMate System SHALL broadcast the disabled state and allow normal tab navigation
4. WHEN LockMode state changes THEN the FocusMate System SHALL display the current state in the teacher dashboard
5. WHEN LockMode is active THEN the Student Classroom SHALL display a LockMode indicator

### Requirement 9

**User Story:** As a teacher, I want to end a classroom session, so that I can finalize the class and generate reports.

#### Acceptance Criteria

1. WHEN a teacher clicks end session THEN the FocusMate System SHALL terminate all video connections and close the session
2. WHEN a session ends THEN the FocusMate System SHALL generate a final class report with all student metrics
3. WHEN a session ends THEN the FocusMate System SHALL persist all attention samples and status timelines to the database
4. WHEN a session ends THEN the FocusMate System SHALL disconnect all students and notify them via WebSocket
5. WHEN a session ends THEN the FocusMate System SHALL make the session report available in the teacher reports section

### Requirement 10

**User Story:** As a teacher, I want to view detailed reports for past sessions, so that I can analyze student engagement over time.

#### Acceptance Criteria

1. WHEN a teacher accesses the reports section THEN the FocusMate System SHALL display a list of all past sessions with dates and summary metrics
2. WHEN a teacher clicks on a session THEN the FocusMate System SHALL display a detailed report including attention timeline, final scores, status transitions, and tab switch counts for each student
3. WHEN viewing a session report THEN the FocusMate System SHALL provide export functionality for CSV and PDF formats
4. WHEN a report is exported THEN the FocusMate System SHALL generate a file containing all session data in the requested format
5. WHEN displaying status transitions THEN the FocusMate System SHALL show the complete timeline including Absent to Left Class transitions

### Requirement 11

**User Story:** As a student, I want to see my own real-time attention metrics during class, so that I can self-monitor my engagement.

#### Acceptance Criteria

1. WHEN a student is in a session THEN the FocusMate System SHALL display the student's current attention percentage in the right panel
2. WHEN a student is in a session THEN the FocusMate System SHALL display the student's current status text in the right panel
3. WHEN attention metrics change THEN the FocusMate System SHALL update the display in real-time
4. WHEN a student is in a session THEN the FocusMate System SHALL display a mini graph showing attention trends over time
5. WHEN viewing on mobile devices THEN the FocusMate System SHALL make the right panel swipe-friendly and responsive

### Requirement 12

**User Story:** As a student, I want to control my own camera and microphone, so that I can manage my participation in the class.

#### Acceptance Criteria

1. WHEN a student clicks the camera toggle in the bottom toolbar THEN the FocusMate System SHALL enable or disable the student's video transmission
2. WHEN a student clicks the mic toggle in the bottom toolbar THEN the FocusMate System SHALL enable or disable the student's audio transmission
3. WHEN a student clicks leave class THEN the FocusMate System SHALL disconnect the student from the session and record the departure time
4. WHEN the bottom toolbar is displayed on mobile THEN the FocusMate System SHALL optimize button sizing and spacing for touch interaction
5. WHEN a student toggles controls THEN the FocusMate System SHALL update the UI state immediately

### Requirement 13

**User Story:** As a student, I want to view my personal attention reports, so that I can track my engagement performance over time.

#### Acceptance Criteria

1. WHEN a student accesses the My Reports section THEN the FocusMate System SHALL display a list of all sessions the student has attended
2. WHEN a student clicks on a session report THEN the FocusMate System SHALL display the final attention score, status timeline, attendance duration, and tab switch events
3. WHEN viewing a personal report THEN the FocusMate System SHALL provide export functionality for PDF format
4. WHEN a report is exported THEN the FocusMate System SHALL generate a PDF containing the student's session data
5. WHEN displaying the status timeline THEN the FocusMate System SHALL show all status changes with timestamps

### Requirement 14

**User Story:** As the AI Engine, I want to continuously monitor student facial features and behavior, so that I can compute accurate attention metrics.

#### Acceptance Criteria

1. WHEN a student's face is visible THEN the AI Engine SHALL detect facial landmarks using Mediapipe FaceMesh
2. WHEN analyzing facial data THEN the AI Engine SHALL classify the student status as Present, Engaged, Looking Away, or Drowsy
3. WHEN a student's face is not detected for more than 2 seconds THEN the AI Engine SHALL set the status to Absent
4. WHEN a student's status is Absent for more than 10 seconds THEN the AI Engine SHALL set the status to Left Class
5. WHEN processing video frames THEN the AI Engine SHALL compute an attention score between 0 and 100 based on engagement indicators

### Requirement 15

**User Story:** As the AI Engine, I want to send real-time attention updates to the backend, so that teachers and students can see current metrics.

#### Acceptance Criteria

1. WHEN the AI Engine computes new metrics THEN the AI Engine SHALL send attention score, status, and timestamp to the backend via WebSocket
2. WHEN sending updates THEN the AI Engine SHALL include the student identifier and session identifier
3. WHEN the backend receives AI updates THEN the FocusMate System SHALL broadcast the metrics to the teacher dashboard
4. WHEN the backend receives AI updates THEN the FocusMate System SHALL send the metrics to the corresponding student interface
5. WHEN AI updates are received THEN the FocusMate System SHALL store attention samples in the database with timestamps

### Requirement 16

**User Story:** As the Browser Extension, I want to detect when a student switches tabs, so that I can log the event and enforce LockMode.

#### Acceptance Criteria

1. WHEN a student navigates away from the classroom tab THEN the Browser Extension SHALL detect the tab switch event
2. WHEN a tab switch is detected THEN the Browser Extension SHALL send a notification to the backend via WebSocket
3. WHEN LockMode is enabled and a tab switch is attempted THEN the Browser Extension SHALL block the navigation and refocus the classroom tab
4. WHEN LockMode is disabled and a tab switch occurs THEN the Browser Extension SHALL log the event without blocking
5. WHEN a tab switch event is logged THEN the FocusMate System SHALL store the event in the database with timestamp

### Requirement 17

**User Story:** As the Browser Extension, I want to display the current LockMode state, so that students are aware of the restriction status.

#### Acceptance Criteria

1. WHEN the extension popup is opened THEN the Browser Extension SHALL display the current LockMode state (enabled or disabled)
2. WHEN LockMode state changes THEN the Browser Extension SHALL update the popup display in real-time
3. WHEN displaying LockMode state THEN the Browser Extension SHALL prevent students from toggling the state manually
4. WHEN the classroom tab is active THEN the Browser Extension SHALL only enforce LockMode on the classroom URL
5. WHEN the extension is installed THEN the Browser Extension SHALL request necessary permissions for tabs, activeTab, and scripting

### Requirement 18

**User Story:** As the FocusMate System, I want to provide a premium dark UI with neon glow and glassmorphism, so that users have a modern and engaging visual experience.

#### Acceptance Criteria

1. WHEN any page is rendered THEN the FocusMate System SHALL apply a dark theme with neon cyan (#00e6ff) accent colors
2. WHEN displaying UI components THEN the FocusMate System SHALL use glassmorphism effects for cards and panels
3. WHEN displaying the logo THEN the FocusMate System SHALL show a scholar hat merged with "F" in neon cyan
4. WHEN rendering interactive elements THEN the FocusMate System SHALL apply neon glow effects on hover and focus states
5. WHEN the UI is displayed THEN the FocusMate System SHALL maintain consistent branding across all pages and components

### Requirement 19

**User Story:** As a user, I want the entire platform to be fully responsive, so that I can use FocusMate seamlessly on mobile, tablet, and desktop devices.

#### Acceptance Criteria

1. WHEN the platform is accessed on any device THEN the FocusMate System SHALL adapt all layouts to the viewport size
2. WHEN video grids are displayed THEN the FocusMate System SHALL scale cleanly across mobile, tablet, and desktop screen sizes
3. WHEN the bottom toolbar is displayed on mobile THEN the FocusMate System SHALL optimize button placement for thumb-friendly interaction
4. WHEN right side panels are displayed on mobile THEN the FocusMate System SHALL make them swipe-friendly with smooth transitions
5. WHEN the viewport orientation changes THEN the FocusMate System SHALL reflow content to maintain usability

### Requirement 20

**User Story:** As the FocusMate System, I want to persist all session data in a SQLite database, so that reports and analytics are available after sessions end.

#### Acceptance Criteria

1. WHEN a user registers THEN the FocusMate System SHALL store the user record in the Users table
2. WHEN a session is created THEN the FocusMate System SHALL store the session record in the Rooms table
3. WHEN attention metrics are computed THEN the FocusMate System SHALL store samples in the AttentionSamples table with timestamps
4. WHEN student status changes THEN the FocusMate System SHALL store the transition in the StatusTimeline table
5. WHEN a tab switch occurs THEN the FocusMate System SHALL store the event in the TabSwitchEvents table
6. WHEN a session ends THEN the FocusMate System SHALL generate and store a comprehensive report in the ClassReports table

### Requirement 21

**User Story:** As the FocusMate System, I want to handle WebRTC signaling for peer-to-peer video connections, so that teachers and students can communicate in real-time.

#### Acceptance Criteria

1. WHEN a session is created THEN the FocusMate System SHALL establish a WebSocket connection for WebRTC signaling
2. WHEN a peer joins THEN the FocusMate System SHALL exchange ICE candidates and SDP offers via the signaling server
3. WHEN video streams are established THEN the FocusMate System SHALL transmit audio and video data peer-to-peer
4. WHEN network conditions change THEN the FocusMate System SHALL renegotiate connections to maintain stream quality
5. WHEN a peer disconnects THEN the FocusMate System SHALL clean up the connection and notify other participants

### Requirement 22

**User Story:** As a user, I want to see a landing page with clear calls to action, so that I can understand FocusMate and easily access login or registration.

#### Acceptance Criteria

1. WHEN a user visits the root URL THEN the FocusMate System SHALL display a landing page with hero section, logo, and call-to-action buttons
2. WHEN the landing page is displayed THEN the FocusMate System SHALL apply the dark neon glassmorphism theme
3. WHEN a user clicks the CTA button THEN the FocusMate System SHALL navigate to the login or registration page
4. WHEN the landing page is viewed on mobile THEN the FocusMate System SHALL adapt the layout for optimal mobile viewing
5. WHEN the landing page loads THEN the FocusMate System SHALL display the FocusMate logo prominently
