// Set up context menu items
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'saveImageAs',
        title: 'Save Image As',
        contexts: ['image']
    });

    chrome.contextMenus.create({
        id: 'saveAsPNG',
        title: 'PNG',
        parentId: 'saveImageAs',
        contexts: ['image']
    });

    chrome.contextMenus.create({
        id: 'saveAsJPG',
        title: 'JPG',
        parentId: 'saveImageAs',
        contexts: ['image']
    });

    chrome.contextMenus.create({
        id: 'saveAsWebP',
        title: 'WebP',
        parentId: 'saveImageAs',
        contexts: ['image']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const format = info.menuItemId.replace('saveAs', '').toLowerCase();
    
    chrome.tabs.sendMessage(tab.id, {
        action: 'saveImage',
        format: format,
        imageUrl: info.srcUrl
    });
});

// Handle download requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'download') {
        chrome.downloads.download({
            url: message.dataUrl,
            filename: message.filename,
            saveAs: true
        });
    }
});
