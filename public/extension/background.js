// Note: In a real extension, you would use the Firebase JS SDK here.
// For this demo, we simulate the background process that would sync with Firestore.

let blurCount = 0;
let plan = 'free';

// Load initial state
function updateLocalState() {
  chrome.storage.local.get(['blurCount', 'plan', 'activated'], (res) => {
    blurCount = res.blurCount || 0;
    // If activated, ensure plan is set correctly even if it was "free" before
    if (res.activated) {
      plan = res.plan || 'pro';
    } else {
      plan = res.plan || 'free';
    }
  });
}

updateLocalState();

// Listen for storage changes to keep local state synced
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    updateLocalState();
  }
});

// Inject content script into existing tabs on install
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  for (const tab of tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).catch(err => console.log('Could not inject into tab:', tab.url, err));
    
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['extension-styles.css']
    }).catch(err => console.log('Could not inject CSS into tab:', tab.url, err));
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getInitialState") {
    // Return current state from memory
    sendResponse({ blurCount, plan, activated: plan !== 'free' });
    return true; 
  }
  
  if (request.action === "requestBlur") {
    const isActivated = plan !== 'free';
    const today = new Date().toISOString().split('T')[0];
    
    chrome.storage.local.get(['lastTrialDate'], (res) => {
      const lastTrialDate = res.lastTrialDate || "";
      if (lastTrialDate !== today) {
        blurCount = 0;
        chrome.storage.local.set({ blurCount: 0, lastTrialDate: today });
      }
      
      const limitReached = !isActivated && blurCount >= 5;
      
      if (!limitReached) {
        blurCount++;
        chrome.storage.local.set({ blurCount: blurCount });
        console.log("Usage updated:", blurCount);
        sendResponse({ allowed: true, count: blurCount });
      } else {
        console.log("Limit reached:", blurCount);
        sendResponse({ allowed: false, count: blurCount });
      }
    });
    return true;
  }
  
  return true; // Keep channel open for async response
});
