import nodemailer from 'nodemailer';
import axios from 'axios';
import { prisma } from '../../server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@upstash/qstash/nextjs';

type Quote = {
    q: string;
    a: string;
    i: string;
    c: string;
    h: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MOTIVATIONAL_QUOTES_EMAIL,
                pass: process.env.MOTIVATIONAL_QUOTES_EMAIL_PASSWORD,
            },
        });

        const randomQuoteUrl = 'https://zenquotes.io/api/random';
        const subscribers = await prisma.subscriber.findMany();

        await Promise.all(subscribers.map(async subscriber => {
            const response = await axios.get(randomQuoteUrl);
            const [quote] = response.data as Quote[];

            if (!quote) {
                return;
            }

            const text = `${quote.q}\n-${quote.a}`;

            await transporter.sendMail({
                from: '"Motivational Quotes" <motivationalquotes2102@gmail.com>',
                to: subscriber.email,
                subject: 'Your Motivation for Today',
                text,
            });
        }));

        res.status(200).send({ message: 'Motivatonal emails sent' });
    }
}

export default verifySignature(handler);

export const config = {
    api: {
        bodyParser: false,
    },
} 