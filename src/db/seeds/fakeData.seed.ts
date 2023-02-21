import {Factory, Seeder} from "typeorm-seeding";
import {Connection, getRepository} from "typeorm";
import {OrderStatus} from "../../entity/OrderStatus";
import {PaymentStatus} from "../../entity/PaymentStatus";
import {PaymentType} from "../../entity/PaymentType";
import {Order} from "../../entity/Order";
import {Payment} from "../../entity/Payment";

const orderStatus = ["payed", "processing", "shipped", "delivered"]
const paymentStatus = ["pending", "complete", "reject"]
const paymentType = ["paypal", "strip"]

export class FakeDataSeed implements Seeder {
    public  async run(factory: Factory, connection: Connection): Promise<void> {
        let record = null
        let index = 1
        // ========== Order Status ==========
        const repo_orderStatus = getRepository(OrderStatus)
        index = 1
        for (const item of orderStatus) {
            record = new OrderStatus()
            record.orderStatusId = index++
            record.order_status = item
            await repo_orderStatus.save(record)
        }

        // ========== Payment Status ==========
        const repo_paymentStatus  = getRepository(PaymentStatus)
        index = 1
        for (const item of paymentStatus) {
            record = new PaymentStatus()
            record.paymentStatusId = index++
            record.payment_status = item
            await repo_paymentStatus.save(record)
        }

        // ========== Payment Type ==========
        const repo_paymentType = getRepository(PaymentType)
        index = 1
        for (const item of paymentType) {
            record = new PaymentType()
            record.paymentTypeId = index++
            record.payment_type = item
            await repo_paymentType.save(record)
        }

        // ========== Order ==========
        await factory(Order)().map(async o => {
            // console.log('order created: ', o)
            return o
        }).createMany(20)

        // ========== Payment ==========
        await factory(Payment)().map(async p => {
            return p
        }).createMany(20)
    }
}
