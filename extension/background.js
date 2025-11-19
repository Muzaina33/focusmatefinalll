// FocusMate LockMode Background Service Worker
let lockModeEnabled = false;
let classroomTabId = null;
let sessionId = null;
let studentId = null;

console.log('FocusMate Extension: Background service worker loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INIT_LOCKMODE') {
    classroomTabId = sender.tab.id;
    sessionId = message.sessionId;
    studentId = message.studentId;
    lockModeEnabled = message.enabled;
    console.log('LockMode initialized:', { classroomTabId, sessionId, lockModeEnabled });
    sendResponse({ success: true });
  } else if (message.type === 'UPDATE_LOCKMODE') {
    lockModeEnabled = message.enabled;
    console.log('LockMode updated:', lockModeEnabled);
    sendResponse({ success: true });
  }
  return true;
});

// Tab activation listener (tab switch detection)
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (!classroomTabId || !sessionId) return;
  
  // Student switched away from classroom
  if (activeInfo.tabId !== classroomTabId) {
    console.log('Tab switch detected');
    
    if (lockModeEnabled) {
      // Block switch - refocus classroom tab
      chrome.tabs.update(classroomTabId, { active: true });
      logTabSwitch(true); // was blocked
    } else {
      // Just log the switch
      logTabSwitch(false); // not blocked
    }
  }
});

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === classroomTabId && changeInfo.url) {
    // Classroom tab navigated away
    if (!changeInfo.url.includes('localhost:5173/student/classroom')) {
      console.log('Classroom tab navigated away');
      classroomTabId = null;
      sessionId = null;
      lockModeEnabled = false;
    }
  }
});

// Log tab switch event
function logTabSwitch(wasBlocked) {
  if (!sessionId || !studentId) return;
  
  // Send to backend via fetch (WebSocket would be better but requires more setup)
  fetch('http://localhost:8000/api/tab-switch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      student_id: studentId,
      was_blocked: wasBlocked,
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.error('Failed to log tab switch:', err));
  
  console.log('Tab switch logged:', { wasBlocked });
}
