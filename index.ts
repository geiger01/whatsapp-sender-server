const puppeteer = require('puppeteer');

// const nums = [
// 	'+972548773141',
// 	'+972545911550',
// 	'+972558876114',
// 	'+972533324712',
// 	'+972558826406',
// 	'+972538208250',
// 	'+972584336642',
// 	'+972503323023',
// 	'+972523273543',
// 	'+972506881490',
// 	'+972538558924',
// 	'+972506915969',
// 	'+972528776731',
// 	'+972548720124',
// 	'+972539194118',
// 	'+972505176768',
// 	'+972527388480',
// 	'+972543973537',
// 	'+972549294097',
// 	'+972526208105',
// 	'+972537751010',
// 	'+972522788825',
// 	'+972546934745',
// 	'+972522673463',
// 	'+972536233403',
// 	'+972547408309',
// 	'+972543333758',
// 	'+972523289828',
// 	'+972525321199',
// 	'+972533326467',
// 	'+972536233403',
// 	'+972546934745',
// 	'+972532458901',
// 	'+972547408309',
// 	'+972584325111',
// 	'+972505844853',
// 	'+972522673463',
// 	'+972532853239',
// 	'+972543427225',
// 	'+972503467744',
// 	'+972537084032',
// 	'+972543333758',
// 	'+972504002834',
// 	'+972543327589',
// 	'+972523289828',
// 	'+972504567035',
// 	'+972526930878',
// 	'+972533500953',
// 	'+972556602800',
// 	'+972533406275',
// 	'+972546868802',
// 	'+972586725080',
// 	'+972585758255',
// 	'+972535654403',
// 	'+972555514861',
// ];
const nums = ['+972509101164', '+972509101190'];
const msg = `היי, מדברת דניאל אני מחברת מודיעין אזרחי חברת האבטחה הגדולה במדינה, יש לי מגוון משרות באבטחה להציע. במידה ורלוונטי מוזמן לחזור אלי  :) קיבלתי את המספר שלך מהכוונה לחיילים משוחררים ..`;

(async () => {
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
			await sendMessage(page, nums[index]);
		}
	} catch (e) {
		console.log(e, 'not workingggg');
	}
	await browser.close();
})();

async function sendMessage(page, number) {
	try {
		await page.goto(`https://wa.me/${number}`);
		const link = await page.evaluate(() => {
			return document.querySelector('#action-button')?.getAttribute('href');
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
		throw new Error('not working');
	}
}
