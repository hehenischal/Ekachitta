// content.js - Ekachitta: YouTube Focus Filter (Monolithic)

// --- Configuration Constants ---
// NOTE: These selectors are based on your specific input.
// YouTube often changes structure, so these are the most common fallback elements.

// Video Container Selectors (The element we hide/show)
const VIDEO_CONTAINER_SELECTOR_Home = 'ytd-rich-item-renderer';
const VIDEO_CONTAINER_SELECTOR_search = 'yt-lockup-view-model, ytd-video-renderer';
const VIDEO_CONTAINER_SELECTOR_watch = 'yt-lockup-view-model';

// Video Title Selectors (The element text we check for keywords)
const VIDEO_TITLE_SELECTOR_Home = '.yt-core-attributed-string';
const VIDEO_TITLE_SELECTOR_search = '#video-title, yt-formatted-string';
const VIDEO_TITLE_SELECTOR_watch = 'a>.yt-core-attributed-string';

// Channel Name Selectors (The element text we check for whitelisting - FR-05)
const CHANNEL_NAME_SELECTOR_Home = 'span.yt-core-attributed-string';
const CHANNEL_NAME_SELECTOR_search = '.yt-lockup-byline a, ytd-channel-name a';
const CHANNEL_NAME_SELECTOR_watch = '.yt-core-attributed-string';

// Main dynamic areas to observe (where videos are added - FR-04)
const ROOT_CONTAINER_SELECTOR = '#primary, #related';

// Selector for the global search field (FR-02)
const SEARCH_INPUT_SELECTOR = 'input#search, input#search-input';

// Global state variables
let currentKeywords = [];
let errorToastTimeout = null;
const INDICATOR_ID = 'ekachitta-focus-indicator';


// --- Selector Resolution Logic (Dynamic Page Handling) ---

/**
 * Determines the current page type and returns the corresponding set of selectors.
 */
function getActiveSelectors() {
    const url = window.location.href;
    
    if (url.includes('/results')) {
        return {
            container: VIDEO_CONTAINER_SELECTOR_search,
            title: VIDEO_TITLE_SELECTOR_search,
            channel: CHANNEL_NAME_SELECTOR_search,
            pageType: 'Search'
        };
    } else if (url.includes('/watch')) {
        return {
            container: VIDEO_CONTAINER_SELECTOR_watch,
            title: VIDEO_TITLE_SELECTOR_watch,
            channel: CHANNEL_NAME_SELECTOR_watch,
            pageType: 'Watch'
        };
    } else { // Homepage, Subscriptions, etc.
        return {
            container: VIDEO_CONTAINER_SELECTOR_Home,
            title: VIDEO_TITLE_SELECTOR_Home,
            channel: CHANNEL_NAME_SELECTOR_Home,
            pageType: 'Home'
        };
    }
}


// --- FR-08: Error Handling / Fallback ---

/**
 * Shows an error toast if a critical filtering process fails due to DOM changes.
 */
function showToast(message, showFallbackOption = false) {
    clearTimeout(errorToastTimeout);
    let toast = document.getElementById('ekachitta-error-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ekachitta-error-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #cc0000;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 10001;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-size: 14px;
        `;
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `⚠️ Ekachitta: ${message}`;
    if (showFallbackOption) {
        toast.innerHTML += ' <br>Selectors may be outdated. Please check for an extension update.';
    }

    toast.style.display = 'block';
    errorToastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 8000);
}


// --- FR-02: Search Auto-detection ---

/**
 * Extracts a keyword from the URL or search box for temporary filtering.
 * Returns an empty array if not on the search page.
 */
function getSearchKeywords() {
    const url = window.location.href;
    const isSearchPage = url.includes('/results?search_query=');
    const tempKeywords = [];

    if (isSearchPage) {
        try {
            // Get keyword from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('search_query');
            if (query) {
                query.split(/\s+/).map((q) => q.toLowerCase().trim()).filter((q) => q.length > 0).forEach((q) => tempKeywords.push(q));
            }
        } catch (e) {
            // Fallback: Get keyword from the search input field
            const searchInput = document.querySelector(SEARCH_INPUT_SELECTOR);
            if (searchInput && searchInput.value) {
                 tempKeywords.push(searchInput.value.trim().toLowerCase());
            }
        }
    }
    return tempKeywords;
}


// --- FR-03/04/05 Core Filtering Logic ---

/**
 * Hides video elements whose titles do not contain any of the active keywords.
 */
function applyFilter(videoElements, keywords, whitelistedChannels, selectors) {
    if (!videoElements) return;

    try {
        videoElements.forEach(video => {
            // 1. FR-05: WHITELIST CHECK
            const channelElements = video.querySelectorAll(selectors.channel);
            const channelNames = Array.from(channelElements).map(el => el.textContent.trim().toLowerCase());

            if (channelNames.some(name => whitelistedChannels.includes(name))) {
                video.style.display = ''; // Keep visible and skip filtering
                return; 
            }
            
            // 2. FR-03: KEYWORD CHECK
            const titleElement = video.querySelector(selectors.title);
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            
            // Match if AT LEAST ONE keyword is found in the title
            const isMatch = keywords.some(keyword => title.includes(keyword));

            // 3. Apply the filter
            video.style.display = isMatch ? '' : 'none';

        });
    } catch (e) {
        // FR-08: Error when filtering a specific video element
        showToast("Filter encountered an error on an element.", true);
        console.error("Ekachitta Filter Error on element:", e);
    }
}

/**
 * Main function to retrieve settings and apply the filter globally.
 */
function filterVideos() {
    // 1. Get the current page-specific selectors
    const selectors = getActiveSelectors(); 


    chrome.storage.sync.get(['keywords', 'isActive', 'whitelistedChannels','disableShorts', 'disableComments','hyperFocus'], (data) => {
        const storedKeywords = data.keywords || [];
        const isActive = data.isActive !== false; 
        const whitelistedChannels = data.whitelistedChannels || [];
        const disableShorts = data.disableShorts !== false;
        const disableComments = data.disableComments !== false;
        const hyperFocus = data.hyperFocus !== false;

        // FR-07: Disable Comments Section
        const commentsSection = document.getElementById('comments');
        const commentsStatusTag = document.querySelector('ytd-comments');
        if (disableComments) {
            if (commentsSection) {
                commentsSection.style.display = 'none';
            }
            if (commentsStatusTag) {
                commentsStatusTag.style.display = 'none';
            }
        }
        else{
            if (commentsSection) {
                commentsSection.style.display = '';
            }
            if (commentsStatusTag) {
                commentsStatusTag.style.display = '';
            }
        }

        // FR-07: Shorts Sections
        const shortsSections = document.querySelectorAll('ytd-rich-shelf-renderer, grid-shelf-view-model, yt-horizontal-list-renderer, ytd-reel-shelf-renderer');
        if (disableShorts) {
            shortsSections.forEach(section => section.style.display = 'none');
        }
        else
        {
            shortsSections.forEach(section => section.style.display = '');
        }

        const below = document.getElementById('below');
        const secondary = document.getElementById('secondary');
        const container = document.getElementById('masthead-container');
        if (hyperFocus) {
            if (below) below.style.display = 'none';
            if (secondary) secondary.style.display = 'none';
            if (container) container.style.display = 'none';
        }
        else {
            if (below) below.style.display = '';
            if (secondary) secondary.style.display = '';
            if (container) container.style.display = '';
        }


        // FR-02: Integrate temporary search keyword
        const tempKeywords = getSearchKeywords();
        const effectiveKeywords = [...new Set([...storedKeywords, ...tempKeywords])];
        
        currentKeywords = effectiveKeywords;

        // FR-06: Pause Check
        if (!isActive || effectiveKeywords.length === 0) {
            // Reset visibility using the correct container selector
            document.querySelectorAll(selectors.container).forEach(video => {
                video.style.display = ''; 
            });
            updateVisualIndicator(false); 
            return;
        }
        
        // FR-03: Apply filter to all current videos
        const allVideos = document.querySelectorAll(selectors.container); 
        applyFilter(allVideos, effectiveKeywords, whitelistedChannels, selectors); 
        
        updateVisualIndicator(true, effectiveKeywords); // FR-07
    });
}


// --- FR-04: Dynamic Loading Handling ---

/**
 * Sets up a MutationObserver to re-apply the filter when new videos load (infinite scroll).
 */
function setupMutationObserver() {
    // We observe the body for changes.
    const targetNode = document.body; 
    
    if (!targetNode) return;

    const observer = new MutationObserver((mutationsList, observer) => {
        let shouldFilter = false;
        
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if a node was added to the main containers or if navigation occurred
                    if (node.nodeType === 1 && (node.closest(ROOT_CONTAINER_SELECTOR) || node.nodeName === 'YTD-PAGE-MANAGER')) {
                        shouldFilter = true;
                    }
                });
            }
        }
        
        if (shouldFilter) {
            filterVideos(); // FR-04: Re-apply filter on dynamic load/navigation
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
}


// --- FR-07: Visual Indicator ---

/**
 * Updates or removes the visual indicator overlay.
 */
function updateVisualIndicator(show, keywords = []) {
    let indicator = document.getElementById(INDICATOR_ID);

    if (show) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = INDICATOR_ID;
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                right: 0;
                background-color: rgba(204, 0, 0, 0.9);
                color: white;
                padding: 4px 10px;
                font-size: 12px;
                z-index: 10000;
                border-bottom-left-radius: 4px;
                max-width: 300px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
            `;
            // Message to background.js to open the popup for quick edit
            indicator.onclick = () => chrome.runtime.sendMessage({ action: "openPopup" });
            document.body.appendChild(indicator);
        }
        
        const keywordString = currentKeywords.join(', ');
        indicator.innerHTML = `**Ekachitta**: Focus On — ${keywordString}`;
        indicator.style.display = 'block';

    } else if (indicator) {
        indicator.style.display = 'none';
    }
}


// --- Initialization ---

// Listener for messages from popup.js (FR-06 setting change)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "settingsUpdated") {
        filterVideos(); 
    }
});

// Initial filter application
filterVideos(); 
setupMutationObserver();

// Re-run filter on YouTube's internal navigation events (SPA navigation)
window.addEventListener('yt-navigate-finish', filterVideos);
window.addEventListener('popstate', filterVideos);