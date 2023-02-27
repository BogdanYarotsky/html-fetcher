import { StealthBrowser } from "./stealth";
import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = 3000;
const browser = new StealthBrowser();

function startServer() {
    app.get('/', async (req: Request, res: Response) => {
        const content = await browser.getHtml('https://example.com/');
        res.send(content);
    });

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGINT', async () => {
        console.log('Stopping server...');
        await browser.close();
        server.close(() => {
            console.log('Server stopped.');
            process.exit();
        });
    });

    process.on('SIGTERM', async () => {
        console.log('Stopping server...');
        await browser.close();
        server.close(() => {
            console.log('Server stopped.');
            process.exit();
        });
    });
}

browser.start().then(startServer).catch(console.error);
