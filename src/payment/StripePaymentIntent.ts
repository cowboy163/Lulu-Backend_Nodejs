import {NextFunction, Request, Response, Router} from "express";
import * as dotenv from 'dotenv'

dotenv.config()

const stripe = require('stripe')(process.env["STRIPE_SECRET_KEY"])

export class StripePaymentIntent {
    static async create(request: Request, response: Response, nextFunction: NextFunction) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1099,
                currency: 'cad',
                payment_method_types: ['wechat_pay'],
            })

            response.json(paymentIntent)

        } catch (e) {
            response.json(e)
        }
    }
}