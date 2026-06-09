const activationScreen = document.getElementById('activation-screen');
const mainScreen = document.getElementById('main-screen');
const emailInput = document.getElementById('email-address');
const deviceNameInput = document.getElementById('device-name');
const activateBtn = document.getElementById('activate-btn');
const toggleBtn = document.getElementById('toggle-btn');
const displayDevice = document.getElementById('display-device');

// Helper to ensure content script is injected
const ensureScriptInjected = async (tabId) => {
  try {
    // Check if script is already running
    await chrome.tabs.sendMessage(tabId, { action: "ping" });
  } catch (e) {
    // If not, inject it
    console.log("Injecting script into tab", tabId);
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ['extension-styles.css']
    });
  }
};

// Check activation state
chrome.storage.local.get(['activated', 'deviceName', 'keepBlur', 'keepBlurAfterClick', 'blurCount', 'plan', 'lastTrialDate'], (res) => {
  const isActivated = res.activated;
  const lastTrialDate = res.lastTrialDate || "";
  const today = new Date().toISOString().split('T')[0];
  let currentBlurCount = res.blurCount || 0;

  // Daily reset visual check
  if (lastTrialDate !== today && !isActivated) {
    currentBlurCount = 0;
    // We don't save here to avoid unnecessary writes, background script handles it on action
  }

  const currentPlan = res.plan || 'free';
  const isTrialExhausted = currentPlan === 'free' && currentBlurCount >= 5;

  if (isActivated || !isTrialExhausted) {
    mainScreen.style.display = 'flex';
    if (isActivated) {
      displayDevice.parentElement.style.display = 'block';
      displayDevice.innerText = res.deviceName;
      document.getElementById('main-upgrade-btn').style.display = 'none';
    } else {
      displayDevice.parentElement.style.display = 'none';
      document.getElementById('main-upgrade-btn').style.display = 'block';
    }
    
    // Show usage
    const usageContainer = document.createElement('div');
    usageContainer.style.textAlign = 'center';
    usageContainer.style.padding = '8px 0';
    
    const usageText = document.createElement('span');
    usageText.style.fontSize = '11px';
    usageText.style.textTransform = 'uppercase';
    usageText.style.letterSpacing = '0.05em';
    usageText.style.opacity = '0.6';
    
    if (isActivated) {
      usageText.innerText = `License: ${res.plan || 'Pro'}`;
      usageText.style.color = '#FFFFFF';
      usageText.style.opacity = '1';
      usageText.style.fontWeight = '800';
    } else {
      usageText.innerText = `Trial Usage: ${currentBlurCount} / 5`;
      if (currentBlurCount >= 5) {
        usageText.style.color = '#ef4444';
        usageText.style.opacity = '1';
        usageText.style.fontWeight = 'bold';
      }
    }
    usageContainer.appendChild(usageText);
    mainScreen.appendChild(usageContainer);

    // If trial is exhausted but they managed to open the main screen, 
    // show a clean activation prompt if not already activated
    if (!isActivated && isTrialExhausted) {
      const upgradeBtn = document.createElement('button');
      upgradeBtn.innerText = "Get Pro for Unlimited Blurs";
      upgradeBtn.className = "bw-btn";
      upgradeBtn.style.width = "100%";
      upgradeBtn.style.marginTop = "8px";
      upgradeBtn.style.background = "#FFFFFF";
      upgradeBtn.style.color = "#000000";
      upgradeBtn.onclick = () => {
        mainScreen.style.display = 'none';
        activationScreen.style.display = 'flex';
      };
      mainScreen.appendChild(upgradeBtn);
    }
  } else {
    activationScreen.style.display = 'flex';
  }
});

activateBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const device = deviceNameInput.value.trim();

  if (email && device) {
    activateBtn.disabled = true;
    activateBtn.innerText = "Checking...";

    // LOCAL BYPASS for Developer testing in AI Studio Sandbox
    const cleanEmail = email.toLowerCase().trim();
    const isDevBypass = (cleanEmail === "blurraaccesss@gmail.com" || cleanEmail === "olaoluwaadeyi@gmail.com");

    const handleSuccess = (data) => {
      chrome.storage.local.set({ 
        activated: true, 
        deviceName: device,
        email: email,
        plan: (data.plan || 'pro').toLowerCase()
      }, () => {
        // Force sync with background script
        chrome.runtime.sendMessage({ action: "getInitialState" }, () => {
          window.location.reload();
        });
      });
    };

    try {
      // We try the Dev URL first, as it has the absolute latest code
      const urls = [
        'https://ais-dev-qwvslov4ra4azyhuzqhy7p-225093832787.europe-west3.run.app/api/check-subscription',
        'https://ais-pre-qwvslov4ra4azyhuzqhy7p-225093832787.europe-west3.run.app/api/check-subscription'
      ];
      
      let successData = null;
      let authGateDetected = false;

      for (const apiUrl of urls) {
        try {
          console.log("Attempting validation with:", apiUrl);
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
          });

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.warn(`URL ${apiUrl} returned non-JSON. Likely redirected to Login page.`);
            authGateDetected = true;
            continue;
          }

          if (!response.ok) {
            console.warn(`URL ${apiUrl} returned ${response.status}. Skipping.`);
            continue;
          }

          successData = await response.json();
          if (successData && successData.valid) break;
        } catch (e) {
          console.warn(`Failed to connect to ${apiUrl}:`, e);
        }
      }

      if (successData && successData.valid) {
        handleSuccess(successData);
      } else if (isDevBypass) {
        // Developer bypass
        handleSuccess({ valid: true, plan: 'iPro' });
      } else {
        // If not found, redirect to pricing
        alert("No active subscription found for this email. Redirecting to plans...");
        triggerUpgradeModal();
      }
    } catch (err) {
      console.error("Validation error:", err);
      if (isDevBypass) {
        handleSuccess({ valid: true, plan: 'iPro' });
      } else {
        alert(`Error: ${err.message}`);
        activateBtn.disabled = false;
        activateBtn.innerText = "Upgrade to Pro";
      }
    }
  } else {
    alert("Please enter both Email and Username.");
    activateBtn.innerText = "Upgrade to Pro";
    activateBtn.disabled = false;
  }
};

const triggerUpgradeModal = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    await ensureScriptInjected(tabId);
    chrome.tabs.sendMessage(tabId, { action: "showUpgradeModal" });
    window.close();
  });
};

const upgradeLink = document.getElementById('upgrade-link');
const mainUpgradeBtn = document.getElementById('main-upgrade-btn');

if (upgradeLink) upgradeLink.onclick = triggerUpgradeModal;
if (mainUpgradeBtn) mainUpgradeBtn.onclick = triggerUpgradeModal;

const deactivateBtn = document.getElementById('deactivate-btn');

toggleBtn.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    await ensureScriptInjected(tabId);
    chrome.storage.local.set({ isToolbarVisible: true });
    chrome.tabs.sendMessage(tabId, { action: "toggleSelection" });
    window.close(); // Close popup to let user use the toolbar
  });
};

if (deactivateBtn) {
  deactivateBtn.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tabId = tabs[0].id;
      await ensureScriptInjected(tabId);
      chrome.storage.local.set({ isToolbarVisible: false });
      chrome.tabs.sendMessage(tabId, { action: "deactivate" });
      window.close();
    });
  };
}
