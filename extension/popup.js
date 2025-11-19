// FocusMate Extension Popup Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('FocusMate Extension: Popup loaded');
  
  // Get current LockMode state from background
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    const statusElement = document.getElementById('lockmode-status');
    if (response && response.lockModeEnabled) {
      statusElement.textContent = 'LockMode: ON';
      statusElement.style.color = '#00e6ff';
    } else {
      statusElement.textContent = 'LockMode: OFF';
      statusElement.style.color = '#888';
    }
  });
});

// Listen for status updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'LOCKMODE_CHANGED') {
    const statusElement = document.getElementById('lockmode-status');
    if (message.enabled) {
      statusElement.textContent = 'LockMode: ON';
      statusElement.style.color = '#00e6ff';
    } else {
      statusElement.textContent = 'LockMode: OFF';
      statusElement.style.color = '#888';
    }
  }
});
