import {Router} from "express";
import {StripePaymentIntent} from "../payment/StripePaymentIntent";

const router = Router()

router.post('/', StripePaymentIntent.create)

export default router

