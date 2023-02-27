import puppeteer, { Browser, Page } from 'puppeteer-core';

export class StealthBrowser {
    private browser?: Browser;
    private tabs: Page[] = [];

    async start(totalTabs: number = 1) {
        if (totalTabs < 0) {
            totalTabs = 1;
        }

        this.browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox']
        });

        while (totalTabs--) {
            const page = await this.browser.newPage();
            // todo - add interceptor
            this.tabs.push(page);
        }
    }

    async getHtml(url: string) {
        const tab = this.tabs.pop();
        if (tab) {
            await tab.goto('https://example.com/', { waitUntil: 'domcontentloaded' });
            const content = await tab.content();
            this.tabs.push(tab);
            return content;
        }

        return 'todo - handle out of tabs scenario';
    }

    async close() {
        await this.browser?.close();
        this.tabs = [];
    }
}