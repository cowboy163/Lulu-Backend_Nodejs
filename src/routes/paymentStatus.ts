import {Router} from "express";
import {PaymentStatusController} from "../controller/PaymentStatusController";

const router = Router()

router.post('/', PaymentStatusController.create)
router.post('/:paymentStatusId', PaymentStatusController.update)
router.get('/', PaymentStatusController.all)
router.get('/:paymentStatusId', PaymentStatusController.one)
router.delete('/:paymentStatusId', PaymentStatusController.delete)

export default router