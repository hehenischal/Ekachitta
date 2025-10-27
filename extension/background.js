// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Listener for FR-07 quick edit button click
    if (request.action === "openPopup") {
        chrome.action.openPopup();
    }
});