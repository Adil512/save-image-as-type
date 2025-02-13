const { convertImage } = require('../../src/content');

describe('Image Converter', () => {
    test('should convert PNG to JPG', async () => {
        const result = await convertImage('test.png', 'jpg', 0.8);
        expect(result.filename).toMatch(/\.jpg$/);
    });

    test('should handle invalid formats', async () => {
        await expect(convertImage('test.png', 'invalid')).rejects.toThrow();
    });
});
