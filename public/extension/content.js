let isSelectionMode = false;
let currentMode = 'element'; // 'element', 'text', 'area', 'image', 'title'
let blurIntensity = 10;
let keepAfterRefresh = false; // Persistent blurs
let keepAfterClick = false;   // Prevents unblur on click
let isHidingTitle = false;
let originalTitle = document.title;
let currentSessionBlurs = [];

// State for Area Blur
let isDrawing = false;
let startX, startY;
let currentRect = null;
let drawContainer = document.body;

// Helper to find nearest scroll parent
function getScrollParent(node) {
  if (!node || node === document.body || node === document.documentElement) return document.body;
  const style = window.getComputedStyle(node);
  const overflow = style.overflow + style.overflowY + style.overflowX;
  // If it scrolls, return it
  if (/(auto|scroll)/.test(overflow) && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)) {
    return node;
  }
  return getScrollParent(node.parentNode);
}

// Initialize
let observer = null;
let cachedBlurs = null;
let applyTimeout = null;

function debouncedApplyBlurs() {
  if (applyTimeout) clearTimeout(applyTimeout);
  applyTimeout = setTimeout(() => {
    const domain = window.location.hostname;
    const domainBlurs = cachedBlurs[domain] || [];
    if (keepAfterRefresh && domainBlurs.length > 0) {
      applySavedBlurs(domainBlurs);
    }
  }, 150); // Small debounce to avoid lag on heavy mutations
}

function injectEarlyStyles(blurs) {
  if (!blurs || !Array.isArray(blurs)) return;
  
  // Only inject highly specific selectors to avoid "blur entire page" bug
  // We prioritize IDs and specific attribute matches for early injection
  const selectors = blurs
    .filter(b => b.type === 'element' && b.selector)
    .filter(b => {
      // Safety check: ensure selector isn't too broad (like just 'div' or 'p')
      const s = b.selector;
      return s.includes('#') || s.includes('[') || s.split('>').length > 2;
    })
    .map(b => b.selector);
    
  if (selectors.length === 0) return;
  
  let style = document.getElementById('blurweb-early-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'blurweb-early-styles';
    // Inject at Document level for zero-latency
    (document.head || document.documentElement).appendChild(style);
  }

  const intensity = blurIntensity || 10;
  style.textContent = `
    ${selectors.join(', ')} {
      filter: blur(${intensity}px) !important;
      pointer-events: auto !important;
      transition: none !important;
      outline: none !important;
      box-shadow: none !important;
      will-change: filter !important;
      backface-visibility: hidden;
      transform: translateZ(0); /* Force GPU layer */
    }
  `;
}

function initMutationObserver() {
  if (observer) observer.disconnect();
  
  let rafId = null;

  // Optimizing for high frequency DOM changes (e.g., millions of messages in a chat app)
  observer = new MutationObserver((mutations) => {
    if (!keepAfterRefresh || !cachedBlurs) return;
    
    // Check if anything relevant was added
    const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
    if (!hasNewNodes) return;

    // Batch updates to next animation frame to avoid layout thrashing
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const domain = window.location.hostname;
      const domainBlurs = cachedBlurs[domain] || [];
      if (domainBlurs.length > 0) {
        applySavedBlurs(domainBlurs);
      }
      rafId = null;
    });
  });
  
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

chrome.storage.local.get(['keepBlur', 'keepBlurAfterClick', 'savedBlurs', 'intensity', 'isToolbarVisible', 'currentMode'], (res) => {
  keepAfterRefresh = res.keepBlur || false;
  keepAfterClick = res.keepBlurAfterClick || false;
  blurIntensity = Math.min(10, res.intensity || 10);
  cachedBlurs = res.savedBlurs || {};
  currentMode = res.currentMode || 'element';
  if (currentMode === 'magic') currentMode = 'element';
  document.documentElement.style.setProperty('--blur-intensity', `${blurIntensity}px`);
  
  const domain = window.location.hostname;
  const domainBlurs = cachedBlurs[domain] || [];

  // FAST PATH: Inject styles immediately if persistence is on
  if (keepAfterRefresh && domainBlurs.length > 0) {
    injectEarlyStyles(domainBlurs);
  }

  // Apply immediately if possible
  const init = () => {
    if (keepAfterRefresh && domainBlurs.length > 0) {
      applySavedBlurs(domainBlurs);
      initMutationObserver();
    }
    if (res.isToolbarVisible) {
      createToolbar();
    }
  };

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
});

// Watch for storage changes from popup or background
chrome.storage.onChanged.addListener((changes) => {
  if (changes.savedBlurs) {
    cachedBlurs = changes.savedBlurs.newValue || {};
    if (keepAfterRefresh) {
      applySavedBlurs(cachedBlurs);
    }
  }
  if (changes.keepBlur) {
    keepAfterRefresh = changes.keepBlur.newValue;
    if (keepAfterRefresh) {
      initMutationObserver();
      if (cachedBlurs) applySavedBlurs(cachedBlurs);
    } else if (observer) {
      observer.disconnect();
    }
  }
});

// --- Icons (SVG Strings) ---
const ICONS = {
  element: `<svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>`,
  text: `<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
  area: `<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke-dasharray="4 4" fill="none" stroke="currentColor"/></svg>`,
  image: `<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" fill="none" stroke="currentColor"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  hide: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><path class="eye-slash" d="M1 1 23 23" style="stroke: currentColor; stroke-width: 2;"/></svg>`,
  brush: `<svg viewBox="0 0 24 24"><path d="m9 11 3 3L22 4"/><path d="m21 12-9 9-9-9 9-9 3 3"/></svg>`,
  close: `<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
};

// --- UI Components ---
function createToolbar() {
  if (document.getElementById('blurweb-toolbar')) return;
  
  const toolbar = document.createElement('div');
  toolbar.id = 'blurweb-toolbar';
  toolbar.innerHTML = `
    <div class="bw-tool" data-mode="element" title="Element Blur">${ICONS.element}</div>
    <div class="bw-tool" data-mode="text" title="Text Blur">${ICONS.text}</div>
    <div class="bw-tool" data-mode="area" title="Area Blur">${ICONS.area}</div>
    <div class="bw-tool" data-mode="image" title="Image Blur">${ICONS.image}</div>
    <div class="bw-tool" data-mode="title" title="Hide/Show Page Title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
        <line class="eye-slash" x1="2" y1="2" x2="22" y2="22" style="display: none;" />
      </svg>
    </div>
    <div class="bw-tool" data-mode="clear" title="Clear All Blurs">${ICONS.brush}</div>
    
    <div class="bw-divider"></div>
    
    <div class="bw-intensity-wrapper">
      <button id="bw-minus" class="bw-intensity-btn" title="Decrease Intensity"></button>
      <div class="bw-intensity-val-container">
        <span id="bw-val">${blurIntensity}</span>
      </div>
      <button id="bw-plus" class="bw-intensity-btn" title="Increase Intensity"></button>
    </div>
    
    <div class="bw-divider"></div>

    <div class="bw-keep-toggles">
      <div class="bw-keep-toggle-container">
        <span class="bw-keep-label">KEEP AFTER REFRESH</span>
        <div id="bw-keep-refresh-toggle" class="bw-toggle ${keepAfterRefresh ? 'active' : ''}">
          <div class="bw-toggle-dot"></div>
        </div>
      </div>
      <div class="bw-keep-toggle-container">
        <span class="bw-keep-label">KEEP AFTER CLICK</span>
        <div id="bw-keep-click-toggle" class="bw-toggle ${keepAfterClick ? 'active' : ''}">
          <div class="bw-toggle-dot"></div>
        </div>
      </div>
    </div>
    
    <div class="bw-divider"></div>
    
    <div class="bw-tool bw-close" data-mode="close" title="Close Toolbar">${ICONS.close}</div>
  `;
  document.body.appendChild(toolbar);
  chrome.storage.local.set({ isToolbarVisible: true });

  const minusBtn = document.getElementById('bw-minus');
  const plusBtn = document.getElementById('bw-plus');
  if (minusBtn) minusBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>`;
  if (plusBtn) plusBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`;

  updateTitleIconState();

  // Intensity controls
  const minus = document.getElementById('bw-minus');
  const plus = document.getElementById('bw-plus');
  
  if (minus) minus.onclick = (e) => { e.stopPropagation(); updateIntensity(-1); };
  if (plus) plus.onclick = (e) => { e.stopPropagation(); updateIntensity(1); };
  
  // Refresh Toggle
  const refreshToggle = document.getElementById('bw-keep-refresh-toggle');
  if (refreshToggle) refreshToggle.onclick = (e) => {
    e.stopPropagation();
    toggleKeepRefresh();
    refreshToggle.classList.toggle('active', keepAfterRefresh);
  };

  // Click Toggle
  const clickToggle = document.getElementById('bw-keep-click-toggle');
  if (clickToggle) clickToggle.onclick = (e) => {
    e.stopPropagation();
    toggleKeepClick();
    clickToggle.classList.toggle('active', keepAfterClick);
  };

  // Tool selection
  toolbar.querySelectorAll('.bw-tool').forEach(tool => {
    tool.onclick = (e) => {
      e.stopPropagation();
      const mode = tool.dataset.mode;
      if (mode === 'clear') clearAll();
      else if (mode === 'title') toggleTitle();
      else if (mode === 'close') stopSelection();
      else setMode(mode);
    };
  });
  
  // Set initial state
  setMode(currentMode);
}

// --- Core Logic ---

function setMode(mode) {
  // If clicking active mode -> Toggle off (cancel out the tool)
  if (isSelectionMode && currentMode === mode) {
    isSelectionMode = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('bw-text-mode');
    document.querySelectorAll('.bw-tool').forEach(t => t.classList.remove('active'));
    // Deselecting a tool should NOT remove the blurs, it just exits selection mode.
    return;
  }

  currentMode = mode;
  isSelectionMode = true;
  document.body.style.cursor = (mode === 'area' || mode === 'image') ? 'crosshair' : 'pointer';
  
  // Apply text mode highlight class
  if (mode === 'text') {
    document.body.classList.add('bw-text-mode');
  } else {
    document.body.classList.remove('bw-text-mode');
  }

  // Persist mode
  chrome.storage.local.set({ currentMode: mode });
  
  // Visual feedback on toolbar
  document.querySelectorAll('.bw-tool').forEach(t => t.classList.remove('active'));
  const activeTool = document.querySelector(`[data-mode="${mode}"]`);
  if (activeTool) activeTool.classList.add('active');
}

function clearSession() {
  currentSessionBlurs.forEach(el => {
    if (el.parentNode) {
      if (el.classList.contains('bw-area-blur')) el.remove();
      else el.classList.remove('blurweb-blurred');
    }
  });
  currentSessionBlurs = [];
}

function updateIntensity(delta) {
  blurIntensity = Math.max(1, Math.min(10, blurIntensity + delta));
  const valDisplay = document.getElementById('bw-val');
  if (valDisplay) valDisplay.innerText = blurIntensity;
  document.documentElement.style.setProperty('--blur-intensity', `${blurIntensity}px`);
  chrome.storage.local.set({ intensity: blurIntensity });
}

function toggleTitle() {
  isHidingTitle = !isHidingTitle;
  if (isHidingTitle) {
    document.title = "••••••••";
    // Also try to hide common URL/breadcrumb elements if they exist
    const selectors = [
      '[class*="breadcrumb"]', '[id*="breadcrumb"]', 
      '[class*="url-display"]', '[id*="url-display"]',
      'header [href*="' + window.location.hostname + '"]',
      'footer [href*="' + window.location.hostname + '"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      // Only hide if it looks like it's displaying the current site link
      if (el.innerText.includes(window.location.hostname) || el.classList.contains('breadcrumb')) {
        el.style.visibility = 'hidden';
        el.dataset.blurredByBlura = 'true';
      }
    });
  } else {
    document.title = originalTitle;
    document.querySelectorAll('[data-blurred-by-blura="true"]').forEach(el => {
      el.style.visibility = 'visible';
      delete el.dataset.blurredByBlura;
    });
  }
  updateTitleIconState();
}

function updateTitleIconState() {
  const eyeSlash = document.querySelector('[data-mode="title"] .eye-slash');
  if (eyeSlash) {
    eyeSlash.style.display = isHidingTitle ? 'block' : 'none';
  }
}

function toggleKeepRefresh() {
  keepAfterRefresh = !keepAfterRefresh;
  chrome.storage.local.set({ keepBlur: keepAfterRefresh });
  if (keepAfterRefresh) {
    saveBlurState();
  } else {
    // If turning off refresh persistence, we clear the saved state for this domain
    const domain = window.location.hostname;
    chrome.storage.local.get(['savedBlurs'], (res) => {
      const allBlurs = res.savedBlurs || {};
      delete allBlurs[domain];
      chrome.storage.local.set({ savedBlurs: allBlurs });
    });
  }
}

function toggleKeepClick() {
  keepAfterClick = !keepAfterClick;
  chrome.storage.local.set({ keepBlurAfterClick: keepAfterClick });
}

// Hover Effect
document.addEventListener('mouseover', (e) => {
  if (!isSelectionMode || e.target.closest('#blurweb-toolbar')) return;

  if (currentMode === 'element' || currentMode === 'image' || currentMode === 'text') {
    if (currentMode === 'image') {
      const img = e.target.closest('img') || (window.getComputedStyle(e.target).backgroundImage !== 'none' ? e.target : null);
      if (img) img.classList.add('bw-hover');
    } else {
      e.target.classList.add('bw-hover');
    }
  }
});

document.addEventListener('mouseout', (e) => {
  e.target.classList.remove('bw-hover');
  const parent = e.target.parentElement;
  if (parent) parent.classList.remove('bw-hover');
});

// Click to Blur / Unblur
document.addEventListener('click', (e) => {
  if (e.target.closest('#blurweb-toolbar') || e.target.closest('.bw-modal')) return;

  const blurred = e.target.classList.contains('bw-area-blur') ? e.target : e.target.closest('.blurweb-blurred, .blurweb-blurred-simple');
  
  // 1. If we clicked a blurred element
  if (blurred) {
    if (!keepAfterClick) {
      e.preventDefault();
      e.stopPropagation();
      
      if (blurred.classList.contains('bw-area-blur')) {
        blurred.remove();
      } else {
        blurred.classList.remove('blurweb-blurred', 'blurweb-blurred-simple');
      }
      
      currentSessionBlurs = currentSessionBlurs.filter(el => el !== blurred);
      if (keepAfterRefresh) saveBlurState();
    }
    return;
  }

  // 2. Otherwise Apply Blur (only if in selection mode)
  if (!isSelectionMode) return;

  e.preventDefault();
  e.stopPropagation();

  chrome.runtime.sendMessage({ action: "requestBlur" }, (res) => {
    if (res && !res.allowed) {
      showLimitModal();
      return;
    }

    // Always remove hover outline on click
    e.target.classList.remove('bw-hover');

    if (currentMode === 'element') {
      e.target.classList.add('blurweb-blurred');
      currentSessionBlurs.push(e.target);
      if (keepAfterRefresh) saveBlurState();
    } else if (currentMode === 'image') {
      const img = e.target.closest('img') || (window.getComputedStyle(e.target).backgroundImage !== 'none' ? e.target : null);
      if (img) {
        img.classList.add('blurweb-blurred');
        currentSessionBlurs.push(img);
        if (keepAfterRefresh) saveBlurState();
      }
    } else if (currentMode === 'text') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const selectionText = selection.toString();
        
        try {
          // Robust text blurring: wrap selection in a span
          if (range.startContainer === range.endContainer) {
            const span = document.createElement('span');
            span.className = 'blurweb-blurred';
            range.surroundContents(span);
            currentSessionBlurs.push(span);
          } else {
            // Range spans across multiple nodes
            const fragment = range.extractContents();
            const span = document.createElement('span');
            span.className = 'blurweb-blurred';
            span.appendChild(fragment);
            range.insertNode(span);
            currentSessionBlurs.push(span);
          }
          
          if (keepAfterRefresh) saveBlurState();
          window.getSelection().removeAllRanges();
        } catch (err) {
          console.error("Text blur failed:", err);
          // Fallback if structure is too complex
          const span = document.createElement('span');
          span.className = 'blurweb-blurred-simple';
          span.textContent = selectionText;
          range.deleteContents();
          range.insertNode(span);
          currentSessionBlurs.push(span);
          if (keepAfterRefresh) saveBlurState();
        }
      }
    }
  });
}, true);

// Area Blur (Drawing)
document.addEventListener('mousedown', (e) => {
  if (!isSelectionMode || currentMode !== 'area' || e.target.closest('#blurweb-toolbar') || e.target.closest('.bw-modal')) return;

  // Don't start drawing if clicking on an existing blur to remove it
  if (e.target.classList.contains('bw-area-blur') || e.target.closest('.blurweb-blurred')) return;

  isDrawing = true;
  
  // Find the smartest container to attach to (for scrolling support)
  const target = document.elementFromPoint(e.clientX, e.clientY);
  drawContainer = getScrollParent(target);

  // Ensure container can contain absolute children
  if (window.getComputedStyle(drawContainer).position === 'static') {
    drawContainer.style.position = 'relative';
  }

  const containerRect = drawContainer.getBoundingClientRect();
  
  // Relative to container content (including its scroll position)
  startX = e.clientX - containerRect.left + drawContainer.scrollLeft;
  startY = e.clientY - containerRect.top + drawContainer.scrollTop;
  
  currentRect = document.createElement('div');
  currentRect.className = 'bw-area-blur';
  currentRect.style.left = `${startX}px`;
  currentRect.style.top = `${startY}px`;
  currentRect.style.width = '0px';
  currentRect.style.height = '0px';
  drawContainer.appendChild(currentRect);
});

document.addEventListener('mousemove', (e) => {
  if (!isDrawing || !currentRect) return;
  
  const containerRect = drawContainer.getBoundingClientRect();
  const currentX = e.clientX - containerRect.left + drawContainer.scrollLeft;
  const currentY = e.clientY - containerRect.top + drawContainer.scrollTop;
  
  const width = currentX - startX;
  const height = currentY - startY;
  
  currentRect.style.width = `${Math.abs(width)}px`;
  currentRect.style.height = `${Math.abs(height)}px`;
  currentRect.style.left = `${width > 0 ? startX : currentX}px`;
  currentRect.style.top = `${height > 0 ? startY : currentY}px`;
});

document.addEventListener('mouseup', () => {
  if (isDrawing) {
    isDrawing = false;
    chrome.runtime.sendMessage({ action: "requestBlur" }, (res) => {
      if (res && !res.allowed) {
        currentRect.remove();
        showLimitModal();
        return;
      }
      
      currentSessionBlurs.push(currentRect);
      if (keepAfterRefresh) saveBlurState();
    });
  }
});

function clearAll() {
  document.querySelectorAll('.blurweb-blurred, .blurweb-blurred-simple, .bw-area-blur').forEach(el => {
    if (el.classList.contains('bw-area-blur')) el.remove();
    else el.classList.remove('blurweb-blurred', 'blurweb-blurred-simple');
  });
  
  const earlyStyles = document.getElementById('blurweb-early-styles');
  if (earlyStyles) earlyStyles.remove();

  currentSessionBlurs = [];
  
  const domain = window.location.hostname;
  chrome.storage.local.get(['savedBlurs'], (res) => {
    const allBlurs = res.savedBlurs || {};
    delete allBlurs[domain];
    cachedBlurs = allBlurs;
    chrome.storage.local.set({ savedBlurs: allBlurs });
  });
}

function stopSelection() {
  isSelectionMode = false;
  document.body.style.cursor = 'default';
  document.body.classList.remove('bw-text-mode');
  document.getElementById('blurweb-toolbar')?.remove();
  document.querySelectorAll('.bw-hover').forEach(el => el.classList.remove('bw-hover'));
  chrome.storage.local.set({ isToolbarVisible: false });
}

function saveBlurState() {
  const blurs = [];
  // Store session metadata for persistence
  chrome.storage.local.set({ currentMode: currentMode });
  
  document.querySelectorAll('.blurweb-blurred, .blurweb-blurred-simple').forEach(el => {
    const selector = getUniqueSelector(el);
    if (selector) {
      const data = { 
        type: 'element', 
        selector, 
        isSimple: el.classList.contains('blurweb-blurred-simple'),
        text: el.innerText.slice(0, 100)
      };
      if (el.tagName === 'IMG') data.src = el.src;
      blurs.push(data);
    }
  });

  document.querySelectorAll('.bw-area-blur').forEach(el => {
    const parent = el.parentElement;
    const parentSelector = parent === document.body ? 'body' : getUniqueSelector(parent);
    blurs.push({
      type: 'area', top: el.style.top, left: el.style.left, width: el.style.width, height: el.style.height, parentSelector
    });
  });

  const domain = window.location.hostname;
  // Update CSS immediately for smoothness
  injectEarlyStyles(blurs);

  chrome.storage.local.get(['savedBlurs'], (res) => {
    const allBlurs = res.savedBlurs || {};
    allBlurs[domain] = blurs;
    cachedBlurs = allBlurs;
    chrome.storage.local.set({ savedBlurs: allBlurs });
  });
}

function applySavedBlurs(blurs) {
  if (!blurs || !Array.isArray(blurs)) return;

  blurs.forEach(data => {
    if (data.type === 'element') {
      try {
        let el = document.querySelector(data.selector);
        
        // Robust matching for dynamic elements
        if (!el) {
          if (data.src) {
            el = document.querySelector(`img[src="${data.src}"]`);
          } else if (data.text) {
             // Search for text match if selector fails
             const possibleParents = document.querySelectorAll('p, div, span, pre, code, h1, h2, h3, li, [role="button"], button');
             for (const parent of possibleParents) {
               if (parent.innerText && parent.innerText.trim() === data.text.trim()) {
                 el = parent;
                 break;
               }
               // Partial match for longer paragraphs
               if (data.text.length > 20 && parent.innerText && parent.innerText.includes(data.text)) {
                 el = parent;
                 break;
               }
             }
          }
        }
        
        if (el && !el.classList.contains('blurweb-blurred') && !el.classList.contains('blurweb-blurred-simple')) {
          el.classList.add(data.isSimple ? 'blurweb-blurred-simple' : 'blurweb-blurred');
        }
      } catch (e) {}
    } else if (data.type === 'area') {
      const parent = data.parentSelector === 'body' || !data.parentSelector ? document.body : document.querySelector(data.parentSelector);
      if (!parent) return;

      // Avoid duplicates in the same parent at same coords
      const exists = Array.from(parent.querySelectorAll('.bw-area-blur')).some(b => 
        b.style.top === data.top && b.style.left === data.left
      );
      if (!exists) {
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        const rect = document.createElement('div');
        rect.className = 'bw-area-blur';
        rect.style.top = data.top;
        rect.style.left = data.left;
        rect.style.width = data.width;
        rect.style.height = data.height;
        parent.appendChild(rect);
      }
    }
  });
}

function getUniqueSelector(el) {
  if (!el || el === document.body || el === document.documentElement) return null;
  
  // 1. Precise ID match
  if (el.id && !/^\d/.test(el.id)) return `#${CSS.escape(el.id)}`;

  // 2. Stable attribute matches
  const stableAttrs = ['data-testid', 'data-id', 'aria-label', 'name', 'data-icon', 'placeholder'];
  for (const attr of stableAttrs) {
    const val = el.getAttribute(attr);
    if (val && val.length < 100) {
      const selector = `${el.tagName.toLowerCase()}[${attr}="${val.replace(/"/g, '\\"')}"]`;
      try {
        if (document.querySelectorAll(selector).length === 1) return selector;
      } catch (e) {}
    }
  }
  
  // 3. Deep hierarchical path
  let path = '';
  let current = el;
  let depth = 0;
  while (current && current.nodeType === Node.ELEMENT_NODE && depth < 10) {
    let selector = current.nodeName.toLowerCase();
    
    // Include classes for specificity, skipping our internal classes
    if (current.className && typeof current.className === 'string') {
      const skipClasses = ['bw-hover', 'blurweb-blurred', 'blurweb-blurred-simple', 'magic-cursor', 'bw-area-blur'];
      const classes = current.className.split(/\s+/)
        .filter(c => c && !skipClasses.includes(c) && !c.includes('hover:'));
      
      if (classes.length) {
        selector += `.${classes.join('.')}`;
      }
    }

    if (current.parentNode && current.parentNode.children) {
      const siblings = Array.from(current.parentNode.children);
      const sameTagSiblings = siblings.filter(s => s.nodeName === current.nodeName);
      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path = selector + (path ? ' > ' + path : '');
    // Stop early if we reached a parent with an ID
    if (current.id && !/^\d/.test(current.id)) break;
    
    current = current.parentNode;
    depth++;
  }
  
  // Final safety: don't return a selector that's too broad
  if (path && path.length > 2 && !['div', 'p', 'span', 'section', 'article'].includes(path.toLowerCase())) {
    return path;
  }
  return null;
}

function showLimitModal() {
  if (document.querySelector('.bw-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'bw-modal-overlay';
  document.body.appendChild(overlay);

  const planData = {
    Pro: { price: '$4', period: '/month', sub: 'Monthly subscription', link: 'https://buy.polar.sh/polar_cl_lCKsnJoh89xuUvLHTCESHVYjmdbovHSx6ClaT0Wfmws', features: ['Unlimited blurs', 'Blur Area (draw zones)', 'Keep Blur across sessions', 'All browsers & tools', 'Priority support', 'Early feature access'] },
    Yearly: { price: '$38.4', period: '/year', sub: 'billed annually', link: 'https://buy.polar.sh/polar_cl_fw0ZOojWYLoURI6vrk9lsFRYvBM3AEyV1Aowk1rIYiI', features: ['Everything in Pro', 'Lifetime updates', 'Whitelabel dashboard', '3 device activations', '5-day refund guarantee', 'Founding user badge'], isBestValue: true },
    iPro: { price: '$50', period: '/lifetime', sub: 'One-time payment', link: 'https://buy.polar.sh/polar_cl_u2FqTTYUo6I3iTT6SrQeDkq6cJZRrded16pM93UQdvB', features: ['Unlimited blurs', 'Blur Area (draw zones)', 'Keep Blur across sessions', 'All browsers & tools', 'Priority support', 'Early feature access'], isLifetime: true }
  };

  const renderTierSelection = () => {
    chrome.storage.local.get(['trialEmail'], (res) => {
      const email = res.trialEmail || "";
      
      overlay.innerHTML = `
        <div class="bw-modal">
          <div class="bw-modal-close">✕</div>
          <div class="bw-modal-header">
            <h2>Upgrade to Blurra Pro.</h2>
            <p>Choose the plan that fits your workflow.</p>
          </div>
          
          <div class="bw-plans-grid">
            <div class="bw-plan-card" data-plan="Pro">
              <div class="bw-plan-tag" style="background: black; color: white; padding: 4px 12px; border-radius: 99px; width: fit-content; opacity: 1;">MOST POPULAR</div>
              <div class="bw-plan-tag" style="margin-top: 12px; font-size: 14px; opacity: 1; color: black; letter-spacing: normal; text-transform: none; font-weight: 700;">Pro</div>
              <div class="bw-plan-price">${planData.Pro.price}<span>${planData.Pro.period}</span></div>
              <div class="bw-plan-sub">${planData.Pro.sub}</div>
              <ul class="bw-plan-features">
                ${planData.Pro.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <a href="${planData.Pro.link}?customer_email=${encodeURIComponent(email)}" target="_blank" class="bw-plan-btn">Upgrade</a>
            </div>

            <div class="bw-plan-card" data-plan="Yearly">
              <div class="bw-plan-tag" style="background: black; color: white; padding: 4px 12px; border-radius: 99px; width: fit-content; opacity: 1;">BEST VALUE</div>
              <div class="bw-plan-tag" style="margin-top: 12px; font-size: 14px; opacity: 1; color: black; letter-spacing: normal; text-transform: none; font-weight: 700;">Pro (Yearly)</div>
              <div class="bw-plan-price">${planData.Yearly.price}<span>${planData.Yearly.period}</span></div>
              <div class="bw-plan-sub">${planData.Yearly.sub}</div>
              <ul class="bw-plan-features">
                ${planData.Yearly.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <a href="${planData.Yearly.link}?customer_email=${encodeURIComponent(email)}" target="_blank" class="bw-plan-btn" style="background: white; color: black; border: 1px solid black;">Upgrade</a>
            </div>

            <div class="bw-plan-card" data-plan="iPro">
              <div class="bw-plan-tag" style="margin-top: 12px; font-size: 14px; opacity: 1; color: black; letter-spacing: normal; text-transform: none; font-weight: 700;">iPro – Lifetime License</div>
              <div class="bw-plan-price">${planData.iPro.price}<span>${planData.iPro.period}</span></div>
              <div class="bw-plan-sub">${planData.iPro.sub}</div>
              <ul class="bw-plan-features">
                ${planData.iPro.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <a href="${planData.iPro.link}?customer_email=${encodeURIComponent(email)}" target="_blank" class="bw-plan-btn">Upgrade</a>
            </div>
          </div>
        </div>
      `;

      overlay.querySelector('.bw-modal-close').onclick = () => overlay.remove();
    });
  };

  const renderSignup = () => {
    overlay.innerHTML = `
      <div class="bw-modal" style="max-width: 450px;">
        <div class="bw-modal-close">✕</div>
        <div class="bw-modal-header">
          <h2>Trial Exhausted (5/5)</h2>
          <p>Please sign up to continue protecting your privacy with Blurra Pro.</p>
        </div>
        
        <form id="bw-signup-form" style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          <input type="email" id="bw-signup-email" placeholder="Enter your email" required style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 16px; outline: none;">
          <button type="submit" class="bw-plan-btn" style="background: black; border: none; padding: 16px; border-radius: 12px; transform: none; width: 100%;">Continue to Plans</button>
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">Already have a key? Activate it in the extension popup.</p>
        </form>
      </div>
    `;

    overlay.querySelector('.bw-modal-close').onclick = () => overlay.remove();
    overlay.querySelector('#bw-signup-form').onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById('bw-signup-email').value;
      chrome.storage.local.set({ trialEmail: email });
      renderTierSelection();
    };
  };

  chrome.storage.local.get(['trialEmail'], (res) => {
    if (res.trialEmail) {
      renderTierSelection();
    } else {
      renderSignup();
    }
  });

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "pong" });
  } else if (request.action === "toggleSelection") {
    createToolbar();
    setMode('element');
    sendResponse({ status: "active" });
  } else if (request.action === "deactivate") {
    clearAll();
    if (isHidingTitle) {
      toggleTitle();
    }
    stopSelection();
    sendResponse({ status: "inactive" });
  } else if (request.action === "updateKeepRefresh") {
    keepAfterRefresh = request.value;
    if (keepAfterRefresh) {
      saveBlurState();
      initMutationObserver();
    } else if (observer) {
      observer.disconnect();
    }
  } else if (request.action === "updateKeepClick") {
    keepAfterClick = request.value;
  } else if (request.action === "showUpgradeModal") {
    showLimitModal();
  } else if (request.action === "clearAll") {
    clearAll();
  }
});
