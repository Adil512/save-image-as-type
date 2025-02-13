// Function to convert image to desired format
async function convertImage(imageUrl, format, quality = 0.85) {
    try {
        // Fetch the image
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create an image element
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Convert to desired format
        let mimeType;
        switch (format.toLowerCase()) {
            case 'png':
                mimeType = 'image/png';
                break;
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'webp':
                mimeType = 'image/webp';
                break;
            default:
                throw new Error('Unsupported format');
        }

        // Get data URL
        const dataUrl = canvas.toDataURL(mimeType, quality);

        // Generate filename
        const originalFilename = imageUrl.split('/').pop().split('?')[0];
        const extension = format.toLowerCase();
        const filename = `${originalFilename.split('.')[0]}.${extension}`;

        return { dataUrl, filename };
    } catch (error) {
        console.error('Error converting image:', error);
        throw error;
    }
}

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'saveImage') {
        try {
            const imageUrl = message.imageUrl || document.querySelector('img').src;
            const { dataUrl, filename } = await convertImage(imageUrl, message.format, message.quality);

            // Send download request to background script
            chrome.runtime.sendMessage({
                action: 'download',
                dataUrl: dataUrl,
                filename: filename
            });

            // Send success status to popup
            chrome.runtime.sendMessage({
                status: `Image saved successfully as ${message.format.toUpperCase()}`
            });
        } catch (error) {
            chrome.runtime.sendMessage({
                status: 'Error saving image: ' + error.message
            });
        }
    }
});
