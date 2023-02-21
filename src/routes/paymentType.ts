import {Router} from "express";
import {PaymentTypeController} from "../controller/PaymentTypeController";

const router = Router()

router.post('/', PaymentTypeController.create)
router.post('/:paymentTypeId', PaymentTypeController.update)
router.get('/', PaymentTypeController.all)
router.get('/:paymentTypeId', PaymentTypeController.one)
router.delete('/:paymentTypeId', PaymentTypeController.delete)

export default router