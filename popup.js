// popup.js

// Function to save all settings (keywords, whitelist, and filter status)
function saveSettings() {
    // FR-01: Keywords
    const keywordText = document.getElementById('keywords').value;
    const keywords = keywordText.split('\n')
                                .map(k => k.trim().toLowerCase())
                                .filter(k => k.length > 0);

    // FR-06: Active Toggle
    const isFilteringActive = document.getElementById('toggleFilter').checked;
    const disableShorts = document.getElementById('toggleShorts').checked;
    const disableComments = document.getElementById('toggleComments').checked;
    const hyperFocus = document.getElementById('toggleHyperFocus').checked;

    // FR-05: Whitelist Channels
    const whitelistText = document.getElementById('whitelist').value;
    const whitelistedChannels = whitelistText.split('\n')
                                .map(k => k.trim().toLowerCase())
                                .filter(k => k.length > 0);

    chrome.storage.sync.set({ 
        keywords: keywords, 
        isActive: isFilteringActive,
        whitelistedChannels: whitelistedChannels,
        disableShorts: disableShorts,
        disableComments: disableComments,
        hyperFocus: hyperFocus
    }, () => {
        // Find the active tab and send a message to trigger immediate filtering
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes("youtube.com")) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "settingsUpdated" });
            }
        });
        updateStatus(isFilteringActive);
        updateShortsStatus(disableShorts);
        updateCommentsStatus(disableComments);
        updateHyperFocus(hyperFocus)
    });
}

// Function to load and display saved settings
function loadSettings() {
    chrome.storage.sync.get(['keywords', 'isActive', 'whitelistedChannels', 'disableShorts', 'disableComments','hyperFocus'], (data) => {
        // Load Keywords (FR-01)
        if (data.keywords) {
            document.getElementById('keywords').value = data.keywords.join('\n');
        }

        // Load Toggle State (FR-06)
        const isActive = data.isActive !== undefined ? data.isActive : true; 
        document.getElementById('toggleFilter').checked = isActive;
        updateStatus(isActive);

        // Load Disable Shorts (FR-07)
        const disableShorts = data.disableShorts !== undefined ? data.disableShorts : false;
        document.getElementById('toggleShorts').checked = disableShorts;
        updateShortsStatus(disableShorts);

        // Load Disable Comments (FR-08)
        const disableComments = data.disableComments !== undefined ? data.disableComments : false;
        document.getElementById('toggleComments').checked = disableComments;
        updateCommentsStatus(disableComments);

        // Hyper Focus (new)
        const hyperFocus = data.hyperFocus !== undefined ? data.hyperFocus : false;
        document.getElementById('toggleHyperFocus').checked = hyperFocus;
        updateHyperFocus(hyperFocus);

        // Load Whitelist (FR-05)
        if (data.whitelistedChannels) {
            document.getElementById('whitelist').value = data.whitelistedChannels.join('\n');
        }
    });
}

// Function to update the visual status (FR-06 helper)
function updateStatus(isActive) {
    const statusSpan = document.getElementById('status');
    if (isActive) {
        statusSpan.textContent = "ACTIVE";
        statusSpan.style.color = "green";
    } else {
        statusSpan.textContent = "PAUSED";
        statusSpan.style.color = "red";
    }
}

// Function to update the shorts status (FR-07 helper)
function updateShortsStatus(disableShorts) {
    const shortsStatusSpan = document.getElementById('shortsstatus');
    if (disableShorts) {
        shortsStatusSpan.textContent = "DISABLED";
        shortsStatusSpan.style.color = "red";
    } else {
        shortsStatusSpan.textContent = "ENABLED";
        shortsStatusSpan.style.color = "green";
    }
}

// Function to update the comments status (FR-08 helper)
function updateCommentsStatus(disableComments) {
    const commentsStatusSpan = document.getElementById('commentsstatus');

    if (disableComments) {
        commentsStatusSpan.textContent = "DISABLED";
        commentsStatusSpan.style.color = "red";
    }
    else {
        commentsStatusSpan.textContent = "ENABLED";
        commentsStatusSpan.style.color = "green";
    }
}

// Function to update the hyper focus status (new helper)
function updateHyperFocus(hyperFocus)
{
    const hyperFocusSpan = document.getElementById('hyperfocusstatus');
    if (hyperFocus) {
        hyperFocusSpan.textContent = "ENABLED";
        hyperFocusSpan.style.color = "green";
    } else {
        hyperFocusSpan.textContent = "DISABLED";
        hyperFocusSpan.style.color = "red";
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('saveKeywordsButton').addEventListener('click', saveSettings);
document.getElementById('saveWhitelistButton').addEventListener('click', saveSettings);
document.getElementById('toggleFilter').addEventListener('change', saveSettings);
document.getElementById('toggleShorts').addEventListener('change', saveSettings);
document.getElementById('toggleComments').addEventListener('change', saveSettings);
document.getElementById('toggleHyperFocus').addEventListener('change', saveSettings);