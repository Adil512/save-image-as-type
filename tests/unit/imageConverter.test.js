import { convertImage } from '../../src/content';

describe('Image Converter Tests', () => {
    // Mock canvas and context
    const mockContext = {
        drawImage: jest.fn()
    };
    
    const mockCanvas = {
        getContext: jest.fn(() => mockContext),
        toDataURL: jest.fn()
    };

    beforeAll(() => {
        global.document.createElement = jest.fn(() => mockCanvas);
        global.Image = class {
            constructor() {
                setTimeout(() => this.onload(), 0);
            }
        };
    });

    test('converts to PNG format', async () => {
        const result = await convertImage('test.jpg', 'png');
        expect(result.filename).toMatch(/\.png$/);
    });

    test('converts to JPG with quality setting', async () => {
        const result = await convertImage('test.png', 'jpg', 0.8);
        expect(result.filename).toMatch(/\.jpg$/);
    });

    test('handles invalid formats', async () => {
        await expect(convertImage('test.png', 'invalid'))
            .rejects.toThrow('Unsupported format');
    });
});
