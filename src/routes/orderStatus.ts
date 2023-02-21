import {Router} from "express";
import {OrderStatusController} from "../controller/OrderStatusController";

const router = Router()

router.post('/', OrderStatusController.create)
router.post('/:orderStatusId', OrderStatusController.update)
router.get('/', OrderStatusController.all)
router.get('/:orderStatusId', OrderStatusController.one)
router.delete('/:orderStatusId', OrderStatusController.delete)

export default router