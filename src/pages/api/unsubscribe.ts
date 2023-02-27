import { prisma } from "../../server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const email = req.query.email as string | undefined;
        const token = req.query.token as string | undefined;

        if (email === undefined) {
            return res.status(400).send({
                error: 'Please provide an email in the search params',
            });
        }

        if (token === undefined) {
            return res.status(400).send({
                error: 'Please provide an unsubscribe token in the search params',
            });
        }

        const subscriber = await prisma.subscriber.findUnique({
            where: {
                email,
            },
            select: {
                unsubscribeToken: true,
            },
        });

        if (subscriber === null) {
            return res.status(500).send({
                error: 'Subscriber not found',
            });
        }

        if (subscriber?.unsubscribeToken === undefined) {
            return res.status(500).send({
                error: 'Unsubscribe token on existing subscriber not found',
            });
        }

        if (token !== subscriber.unsubscribeToken) {
            return res.status(400).send({
                error: 'Unsubscribe token mismatch',
            });
        }

        await prisma.subscriber.delete({
            where: {
                email,
            },
        });

        res.status(200).send({
            message: 'Successfully unsubscribed',
        });
    }
}