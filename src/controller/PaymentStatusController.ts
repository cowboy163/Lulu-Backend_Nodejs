import {NextFunction, Request, Response} from "express";
import {HttpCode, Result} from "../helper/Result";
import {CommonController, ForeignItem} from "./CommonController";
import {PaymentController} from "./PaymentController";
import {PaymentStatus} from "../entity/PaymentStatus";
import {getRepository} from "typeorm";


export class PaymentStatusController {
    public static get repo() {
        return getRepository(PaymentStatus)
    }

    static async create(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {payment_status, payments} = request.body
        let localField = {payment_status}
        let foreignField: Array<ForeignItem> = [
            // {
            //     name: "payments",
            //     field: payments,
            //     foreignRepo: PaymentController.repo,
            //     nullable: true
            // }
        ]
        let paymentStatus = new PaymentStatus()
        let localRepo = PaymentStatusController.repo

        await CommonController.fieldCheckAndStore(localField, foreignField, paymentStatus, localRepo, result)

        return response.status(result.code).send(result)
    }

    static async update(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {paymentStatusId} = request.params
        let localRepo = PaymentStatusController.repo

        let paymentStatus = await CommonController.checkIdExist(Number(paymentStatusId), localRepo, result, false)

        if (result.code === HttpCode.E200) {
            let {payment_status} = request.body
            let localField = {payment_status}
            let foreignField: Array<ForeignItem> = []

            await CommonController.fieldCheckAndStore(localField, foreignField, paymentStatus, localRepo, result)
        }
        return response.status(result.code).send(result)
    }

    static async all(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let localRepo = PaymentStatusController.repo

        await CommonController.findField(localRepo, result)

        return response.status(result.code).send(result)
    }

    static async one(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {paymentStatusId} = request.params
        let localRepo = PaymentStatusController.repo

        await CommonController.findField(localRepo, result, paymentStatusId)

        return response.status(result.code).send(result)
    }

    static async delete(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {paymentStatusId} = request.params
        let localRepo = PaymentStatusController.repo

        let paymentStatus = await CommonController.checkIdExist(Number(paymentStatusId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            await CommonController.fieldSoftDelete(paymentStatus, localRepo, result)
        }

        return response.status(result.code).send(result)
    }
}