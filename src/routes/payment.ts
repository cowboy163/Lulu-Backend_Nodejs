import {Router} from "express";
import {PaymentController} from "../controller/PaymentController";

const router = Router()

// router contents
router.get('/',PaymentController.all)
router.get('/:paymentId',PaymentController.one)
router.post('/',PaymentController.create)
router.put( '/:paymentId',  PaymentController.update)
export default router