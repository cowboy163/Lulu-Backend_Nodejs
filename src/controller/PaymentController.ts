import {getRepository} from "typeorm";
import {Payment} from "../entity/Payment";
import {Request, Response, NextFunction} from "express";
import {Err, ErrStr, HttpCode} from "../helper/Err";
// import {validate} from "class-validator";
import {IdCheckRes} from "./MKController";
import {OrderController} from "./OrderController";
import {MkController} from "./MKController";
import {Result} from "../helper/Result";
import {CommonController, ForeignItem} from "./CommonController";
// import {OrderStatusController} from "./OrderStatusController";
// import {Order} from "../entity/Order";
import {PaymentTypeController} from "./PaymentTypeController";
import {PaymentStatusController} from "./PaymentStatusController";

export class PaymentController extends MkController {

    static async validatePayment(order: number) {
        console.log(typeof order !== 'number');
        console.log(order <= 0);
        if (typeof order !== 'number' || order <= 0) {
            // program stops here if throw is triggered
            throw (new Err(HttpCode.E400, 'invalid order'))
        }

        let res: IdCheckRes[] = []

        try {
            // validate order
            let temp = await PaymentController.checkIdExists([order], OrderController.repo)
            if (temp.index !== -1) {
                throw (new Err(HttpCode.E400, 'invalid order id,' + temp.index))
            }
            res.push(temp)
            // console.log("temp",temp)
        } catch (e) {
            console.log('error, write to db', e)
            throw (new Err(HttpCode.E400, 'invalid order id', e))
        }
        return res
    }

    public static get repo() {
        return getRepository(Payment)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        let payments = []
        try {
            payments = await PaymentController.repo.find({relations:["order"]})
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, payments))
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const {paymentId} = request.params
        if (!paymentId) {
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let payment = null
        try {
            payment = await PaymentController.repo.findOneOrFail(paymentId,{relations:["order"]})
        } catch (e) {
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, payment))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let result = new Result()
        let {
            order,
            payment_type,
            payment_status,
            payment_amount,
            first_name,
            last_name,
            address,
            address_2,
            city,
            province,
            country,
            postcode,
            phone
        } = request.body;
        let localField = {
            payment_amount,
            first_name,
            last_name,
            address,
            address_2,
            city,
            province,
            country,
            postcode,
            phone
        }
        let foreignField: Array<ForeignItem> = [
            {
                name: "payment_type",
                field: payment_type,
                foreignRepo: PaymentTypeController.repo,
                nullable: false
            },
            {
                name: "payment_status",
                field: payment_status,
                foreignRepo: PaymentStatusController.repo,
                nullable: false
            },
            {
                name: "order",
                field: order,
                foreignRepo: OrderController.repo,
                nullable: false,
            }

        ]
        let payment = new Payment()
        let localRepo = PaymentController.repo
        await CommonController.fieldCheckAndStore(localField, foreignField, payment, localRepo, result)

        return response.status(result.code).send(result)

        // let {
        //     order,
        //     payment_type,
        //     payment_status,
        //     payment_amount,
        //     first_name,
        //     last_name,
        //     address,
        //     address_2,
        //     city,
        //     province,
        //     country,
        //     postcode,
        //     phone
        // } = request.body;
        //
        // let payment = new Payment()
        // payment.payment_status = payment_status
        // payment.payment_type = payment_type
        // payment.payment_amount= payment_amount
        // payment.first_name = first_name
        // payment.last_name = last_name
        // payment.address = address
        // payment.address_2 = address_2
        // payment.city = city
        // payment.province = province
        // payment.country = country
        // payment.postcode = postcode
        // payment.phone = phone
        // console.log('payment new', payment)
        //
        // try {
        //     const errors = await validate(payment)
        //     if (errors.length > 0) {
        //         return response.status(400).send(new Err(HttpCode.E400,"", errors))
        //     }
        //     let res = await PaymentController.validatePayment(order)
        //     payment.orders = res[0].entities[0]
        //     await PaymentController.repo.save(payment)
        //
        // } catch (e) {
        //     console.log('error, write to db', e)
        //     return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        // }
        //
        // return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))

    }


    static async delete(request: Request, response: Response, next: NextFunction) {
        return response.send('get')
    }


    static async update(request: Request, response: Response, next: NextFunction) {
        let result = new Result()
        let {paymentId} = request.params
        let localRepo = PaymentController.repo

        let payment = await CommonController.checkIdExist(Number(paymentId), localRepo, result, false)

        if (result.code === HttpCode.E200) {
            let {
                order,
                payment_type,
                payment_status,
                payment_amount,
                first_name,
                last_name,
                address,
                address_2,
                city,
                province,
                country,
                postcode,
                phone
            } = request.body;
            let localField = {
                payment_amount,
                first_name,
                last_name,
                address,
                address_2,
                city,
                province,
                country,
                postcode,
                phone
            }
            let foreignField: Array<ForeignItem> = [
                {
                    name: "payment_type",
                    field: payment_type,
                    foreignRepo: PaymentTypeController.repo,
                    nullable: false
                },
                {
                    name: "payment_status",
                    field: payment_status,
                    foreignRepo: PaymentStatusController.repo,
                    nullable: false
                },
                {
                    name: "order",
                    field: order,
                    foreignRepo: OrderController.repo,
                    nullable: false,
                }

            ]

            await CommonController.fieldCheckAndStore(localField, foreignField, payment, localRepo, result)
        }
        return response.status(result.code).send(result)

        // const {paymentId} = request.params
        //
        // if (!paymentId) {
        //     return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        // }
        // let payment = null
        // try {
        //     payment = await PaymentController.repo.findOneOrFail(paymentId)
        // } catch (e) {
        //     return response.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        // }
        //
        // let {
        //     order,
        //     payment_type,
        //     payment_status,
        //     first_name,
        //     last_name,
        //     address,
        //     city,
        //     province,
        //     country,
        //     postcode,
        //     phone
        // } = request.body;
        //
        // payment.payment_status = payment_status
        // payment.payment_type = payment_type
        // payment.first_name = first_name
        // payment.last_name = last_name
        // payment.address = address
        // payment.city = city
        // payment.province = province
        // payment.country = country
        // payment.postcode = postcode
        // payment.phone = phone
        //
        // const errors = await validate(payment)
        // if (errors.length > 0) {
        //     let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors)
        //     return response.status(400).send(err)
        // }
        // try {
        //     await PaymentController.repo.save(payment)
        //
        // } catch (e) {
        //     return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        // }
        //
        // return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }
}