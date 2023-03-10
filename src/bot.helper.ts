import { Response } from 'express';
import puppeteer, { Page } from 'puppeteer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET,
});

export async function initSend(res: Response, nums: string[], msg: string) {
	const puppeteerOpts = {
		headless: true,
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
			await sendMessage(page, nums[index], msg, index);
		}
	} catch (e) {
		console.log(e, 'error');
		throw new Error(`${e} - not working`);
	}
	await browser.close();
}

async function sendMessage(
	page: Page,
	number: string,
	msg: string,
	idx: number
) {
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
