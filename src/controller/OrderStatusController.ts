import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {OrderStatus} from "../entity/OrderStatus";
import {HttpCode, Result} from "../helper/Result";
import {CommonController, ForeignItem} from "./CommonController";
import {OrderController} from "./OrderController";

export class OrderStatusController {
    public static get repo() {
        return getRepository(OrderStatus)
    }

    static async create(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let orderStatus = new OrderStatus()
        let {order_status} = request.body
        let localField = {order_status}
        let localRepo = OrderStatusController.repo
        let foreignField: Array<ForeignItem> = []

        await CommonController.fieldCheckAndStore(localField, foreignField, orderStatus, localRepo, result)

        return response.status(result.code).send(result)
    }

    static async update(request:Request, response:Response, nextFunction: NextFunction) {
        let {orderStatusId} = request.params
        let localRepo = OrderStatusController.repo
        let result = new Result()

        let orderStatus = await CommonController.checkIdExist(Number(orderStatusId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            let {order_status} = request.body
            let foreignField = []
            let localField = {order_status}

            await CommonController.fieldCheckAndStore(localField, foreignField, orderStatus, localRepo, result)
        }

        return response.status(result.code).send(result)
    }

    static async all (request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let localRepo = OrderStatusController.repo
        let id = ''

        await CommonController.findField(localRepo, result, id)

        return response.status(result.code).send(result)
    }

    static async one (request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let localRepo = OrderStatusController.repo
        let {orderStatusId} = request.params

        await CommonController.findField(localRepo, result, orderStatusId)

        return response.status(result.code).send(result)
    }

    static async delete(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {orderStatusId} = request.params
        let localRepo = OrderStatusController.repo

        let orderStatus = await CommonController.checkIdExist(Number(orderStatusId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            await CommonController.fieldSoftDelete(orderStatus, localRepo, result)
        }

        return response.status(result.code).send(result)
    }
}
