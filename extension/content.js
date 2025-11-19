// FocusMate LockMode Content Script
console.log('FocusMate Extension: Content script loaded');

// Initialize LockMode when page loads
window.addEventListener('load', () => {
  // Check if we're on the student classroom page
  if (window.location.pathname.includes('/student/classroom')) {
    console.log('Student classroom detected');
    
    // Listen for LockMode updates from the page
    window.addEventListener('message', (event) => {
      if (event.data.type === 'LOCKMODE_INIT') {
        chrome.runtime.sendMessage({
          type: 'INIT_LOCKMODE',
          sessionId: event.data.sessionId,
          studentId: event.data.studentId,
          enabled: event.data.enabled
        });
      } else if (event.data.type === 'LOCKMODE_UPDATE') {
        chrome.runtime.sendMessage({
          type: 'UPDATE_LOCKMODE',
          enabled: event.data.enabled
        });
        updateLockModeUI(event.data.enabled);
      }
    });
  }
});

// Update UI to show LockMode status
function updateLockModeUI(enabled) {
  // Remove existing indicator
  const existing = document.getElementById('focusmate-lockmode-indicator');
  if (existing) existing.remove();
  
  if (enabled) {
    // Add LockMode indicator
    const indicator = document.createElement('div');
    indicator.id = 'focusmate-lockmode-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 230, 255, 0.2);
      border: 2px solid #00e6ff;
      border-radius: 12px;
      padding: 12px 20px;
      color: #00e6ff;
      font-weight: bold;
      font-size: 14px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 0 20px rgba(0, 230, 255, 0.5);
    `;
    indicator.innerHTML = '🔒 LockMode Active';
    document.body.appendChild(indicator);
  }
}
