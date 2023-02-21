import {getRepository} from "typeorm";
import {PaymentType} from "../entity/PaymentType";
import {NextFunction, Request, Response} from "express";
import {CommonController} from "./CommonController";
// import {PaymentController} from "./PaymentController";
import {Result, HttpCode} from "../helper/Result";

export class PaymentTypeController {
    public static get repo() {
        return getRepository(PaymentType)
    }

    static async create(request:Request, response: Response, next: NextFunction) {
        let result = new Result()
        let paymentType = new PaymentType()
        let {payment_type} = request.body
        let localField = {payment_type}
        let localRepo = PaymentTypeController.repo
        let foreignField = []

        await CommonController.fieldCheckAndStore(localField, foreignField, paymentType, localRepo, result)

        return response.status(result.code).send(result)
    }

    static async update(request:Request, response: Response, nextFunction: NextFunction) {
        let {paymentTypeId} = request.params
        let localRepo = PaymentTypeController.repo
        let result = new Result()

        let paymentType = await CommonController.checkIdExist(Number(paymentTypeId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            let {payment_type} = request.body
            let localField = {payment_type}
            let foreignField = []

            await CommonController.fieldCheckAndStore(localField, foreignField, paymentType, localRepo, result)
        }

        return response.status(result.code).send(result)
    }

    static async all(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let localRepo = PaymentTypeController.repo

        await CommonController.findField(localRepo, result)

        return response.status(result.code).send(result)
    }

    static async one(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let localRepo = PaymentTypeController.repo
        let {paymentTypeId} = request.params

        await CommonController.findField(localRepo, result, paymentTypeId)

        return response.status(result.code).send(result)
    }

    static async delete(request: Request, response: Response, nextFunction: NextFunction) {
        let result = new Result()
        let {paymentTypeId} = request.params
        let localRepo = PaymentTypeController.repo

        let paymentType = await CommonController.checkIdExist(Number(paymentTypeId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            await  CommonController.fieldSoftDelete(paymentType, localRepo, result)
        }

        return response.status(result.code).send(result)
    }
}