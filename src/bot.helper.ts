import { Response } from 'express';
import puppeteer, { Page } from 'puppeteer';

export async function initSend(res: Response, nums: string[], msg: string) {
	const puppeteerOpts = {
		headless: false,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-features=TranslateUI',
			'--lang="en-US"',
		],
		executablePath: puppeteer.executablePath(),
	};

	const browser = await puppeteer.launch(puppeteerOpts);
	const page = await browser.newPage();
	try {
		for (let index = 0; index < nums.length; index++) {
			await sendMessage(page, nums[index], msg);
		}
	} catch (e) {
		console.log(e, 'error');
        throw new Error(`${e} - not working`);
	}
	await browser.close();
}

async function sendMessage(page: Page, number: string, msg: string) {
    try {
        await page.goto(`https://wa.me/${number}`);
		const link = await page.evaluate(() => {
            return (document as any)
            .querySelector('#action-button')
            ?.getAttribute('href');
		});
        
		if (link) {
            await page.goto(link);
			await page.waitForSelector(
                '[data-testid=conversation-compose-box-input]'
                );
                await page.type('[data-testid=conversation-compose-box-input]', msg);
                await page.waitForTimeout(500);
                await page.click('[data-testid=compose-btn-send]');
                await page.waitForTimeout(500);
            }
        } catch (e) {
        console.log(e, 'error');
		throw new Error(`${e} - not working`);
	}
}
