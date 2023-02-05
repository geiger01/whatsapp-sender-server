import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSend } from './bot.helper';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: '*',
	})
);

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.post('/api/send', async (req: Request, res: Response) => {
	const { msg, nums } = req.body;

	if (!msg || !nums.length) {
		res.status(400).send({ message: 'missing fields', success: false });
	}

	try {
		await initSend(res, nums, msg);
		res.status(200).send({
			message: 'WhatsApp message was successfully sent',
			success: true,
		});
	} catch (e) {
		res.status(400).send({
			message: `${e} - Oops, something went wrong, please try again.`,
			success: false,
		});
		return;
	}
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
