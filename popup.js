document.addEventListener('DOMContentLoaded', function() {
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const status = document.getElementById('status');

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Handle format button clicks
    ['png', 'jpg', 'webp'].forEach(format => {
        document.getElementById(`${format}Btn`).addEventListener('click', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'saveImage',
                    format: format,
                    quality: qualitySlider.value / 100
                });
            });
            status.textContent = `Saving image as ${format.toUpperCase()}...`;
        });
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.status) {
            status.textContent = message.status;
        }
    });
});
