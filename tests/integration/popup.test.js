describe('Popup Integration Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="container">
                <button id="pngBtn">Save as PNG</button>
                <button id="jpgBtn">Save as JPG</button>
                <button id="webpBtn">Save as WebP</button>
                <input type="range" id="quality" value="85">
                <span id="qualityValue">85%</span>
            </div>
        `;
    });

    test('quality slider updates display value', () => {
        const slider = document.getElementById('quality');
        const display = document.getElementById('qualityValue');
        
        slider.value = '90';
        slider.dispatchEvent(new Event('input'));
        
        expect(display.textContent).toBe('90%');
    });

    test('format buttons trigger message sending', () => {
        const sendMessage = jest.spyOn(chrome.runtime, 'sendMessage');
        
        document.getElementById('pngBtn').click();
        
        expect(sendMessage).toHaveBeenCalledWith({
            action: 'saveImage',
            format: 'png'
        });
    });
});
