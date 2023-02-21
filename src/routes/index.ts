import {Router} from "express";
import order from "./order";
import orderStatus from "./orderStatus";
import payment from "./payment";
import paymentType from "./paymentType";
import paymentStatus from "./paymentStatus";
import stripePaymentIntent from "./stripePaymentIntent";

const routes = Router()

routes.use('/order', order)
routes.use('/orderStatus', orderStatus)
routes.use('/payment', payment)
routes.use('/paymentType', paymentType)
routes.use('/paymentStatus', paymentStatus)
routes.use('/paymentIntent', stripePaymentIntent)

export default routes