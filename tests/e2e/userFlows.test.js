import puppeteer from 'puppeteer';

describe('End-to-End Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--disable-extensions-except=./src',
                '--load-extension=./src'
            ]
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('extension popup opens and functions', async () => {
        await page.goto('chrome-extension://YOUR_EXTENSION_ID/popup/popup.html');
        
        // Check if all buttons are present
        const buttons = await page.$$('.format-btn');
        expect(buttons.length).toBe(3);

        // Test quality slider
        await page.$eval('#quality', el => el.value = '75');
        const qualityValue = await page.$eval('#qualityValue', el => el.textContent);
        expect(qualityValue).toBe('75%');
    });
});
