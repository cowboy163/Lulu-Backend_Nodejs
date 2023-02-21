import {getRepository} from "typeorm";
import {Order} from "../entity/Order";
import {Request, Response, NextFunction} from "express";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {Result} from "../helper/Result";
import {CommonController, ForeignItem} from "./CommonController";
import {PaymentController} from "./PaymentController";
import {OrderCheckController} from "./OrderCheckController";
import {OrderStatusController} from "./OrderStatusController";
import {OrderStatus} from "../entity/OrderStatus";
// import {validate} from "class-validator";
const redis = require("redis")

export class OrderController extends OrderCheckController{

    public static get repo() {
        return getRepository( Order)
    }

    // static async idFind(request: Request, response: Response, next: NextFunction) {
    //     let result = new Result()
    //     let local
    //     CommonController.findField()
    //     return response.status(result.code).send(result)
    // }
    static async findPeriod(request: Request, response: Response, next: NextFunction) {
        let result = new Result()
        let {time} = request.params
        let {userId} = request.query
        let end = new Date()
        let start = end
        let period: number = Number(time)
        if(time === 'all') {
            start = new Date(0,0,0,0,0,0,)
            period = 0
        }
        start.setMonth(start.getMonth() - period)

        const localRepo = OrderController.repo
        const entity = await localRepo.createQueryBuilder('table')
            .leftJoinAndSelect('table.order_status', 'order_status')
            .select('table')
            .addSelect('order_status')
            .where(`table.createdAt >= "${start.toISOString()}" AND user=${userId}`)
            .getMany()

        // console.log('test',entity)
        result.setResultData(entity)
        return response.status(result.code).send(result)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        const {userId} = request.query

        let orders = []
        try {
            orders =  await OrderController.repo.find({
                relations: ["order_status"],
                where: {user: userId}
            })
        }catch (e){
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async one(request: Request, response: Response, next: NextFunction) {

        // ========== redis test ==========

        // set redis
        const REDIS_PORT = 6379;
        const REDIS_HOST = '127.0.0.1';
        const REDIS_OPTS = {};
        const REDIS_PWD = 'root'

        let client = redis.createClient(REDIS_PORT, REDIS_HOST, REDIS_OPTS)

        // one value
        client.on('connect', () => {
            // set parameters
            client.set("author", "frank", redis.print);
            client.get("author", redis.print)
            // multiple values
            client.hmset("short", {
                "js": 'javascript',
                "C#": 'C Sharp',
            }, redis.print)

            client.hmset("long", 'SQL', 'Structured Query Language', 'HTML', 'Hypertext Mark-up Language', redis.print)
            client.hgetall('short', (err, res) => {
                if(err) {
                    console.log('Error', err)
                    return
                }
                console.dir(res)
            })

            console.log('connect')
        })

        client.on('ready', (err) => {
            console.log('redis ready!');
        })

        client.auth(REDIS_PWD, () => {
            console.log('auth pass!');
        })

        // ========== redis test ==========

        const {orderId} = request.params
        if(!orderId){
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        }
        let order = null
        try {
            order =  await OrderController.repo.findOneOrFail(orderId, {relations: ["order_status"]})
        }catch (e){
            console.log('error, write to db', e)
            return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK, order))
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let result = new Result()
        let {
            products,
            user,
            order_status,
            price,
            total,
            tax_rate,
            first_name,
            last_name,
            address,
            address_2,
            city,
            province,
            country,
            postcode,
            phone,
        } = request.body;
            let localField = {products, user, price, total, tax_rate, first_name, last_name, address, address_2, city, province, country, postcode, phone}

        let foreignField: Array<ForeignItem> = [
            {
                name: "order_status",
                field: order_status,
                foreignRepo: OrderStatusController.repo,
                nullable: false
            },
        ]
        let order = new Order()
        let localRepo = OrderController.repo
        await CommonController.fieldCheckAndStore(localField, foreignField, order, localRepo, result)

        return response.status(result.code).send(result)
    }

    static async delete(request: Request, response: Response, next: NextFunction) {
        let result = new Result()
        let {orderId} = request.params
        let localRepo = OrderController.repo

        let order = await CommonController.checkIdExist(Number(orderId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            await CommonController.fieldSoftDelete(order, localRepo, result)
        }

        return response.status(result.code).send(result)
    }


    static async update(request: Request, response: Response, next: NextFunction) {
        let {orderId} = request.params
        let localRepo = OrderController.repo
        let result = new Result()

        let order = await CommonController.checkIdExist(Number(orderId), localRepo, result, false)

        if(result.code === HttpCode.E200) {
            let {
                products,
                user,
                order_status,
                // payment,
                price,
                total,
                tax_rate,
                first_name,
                last_name,
                address,
                address_2,
                city,
                province,
                country,
                postcode,
                phone
            } = request.body
            let localField = {products, user, price, total, tax_rate, first_name, last_name, address, address_2, city, province, country, postcode, phone}
            let foreignField: Array<ForeignItem> = [
                {
                    name: "order_status",
                    field: order_status,
                    foreignRepo: OrderStatusController.repo,
                    nullable: false
                },
                // {
                //     name: "payment",
                //     field: payment,
                //     foreignRepo: PaymentController.repo,
                //     nullable: true
                // }
            ]

            await CommonController.fieldCheckAndStore(localField, foreignField, order, localRepo, result)
        }

        return response.status(result.code).send(result)
        // const {orderId} = request.params
        //
        // if(!orderId){
        //     return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrMissingParameter))
        // }
        // let order = null
        // try {
        //     order =  await OrderController.repo.findOneOrFail(orderId)
        // }catch (e){
        //     return response.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        // }
        //
        // let {
        //     products,
        //     user,
        //     order_status,
        //     payment,
        //     price,
        //     total,
        //     tax_rate,
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
        // order.products = products
        // order.user = user
        // order.order_status = order_status
        // order.payment = payment
        // order.price = price
        // order.total = total
        // order.tax_rate = tax_rate
        // order.first_name = first_name
        // order.last_name = last_name
        // order.address = address
        // order.address_2 = address_2
        // order.city = city
        // order.province = province
        // order.country = country
        // order.postcode = postcode
        // order.phone = phone
        // console.log('order new', order)
        //
        // const errors = await validate(order)
        // if(errors.length > 0){
        //     let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter,errors)
        //     return response.status(400).send(err)
        // }
        // try{
        //     await OrderController.repo.save(order)
        //
        // }catch (e){
        //     return response.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        // }
        //
        // return response.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }
}