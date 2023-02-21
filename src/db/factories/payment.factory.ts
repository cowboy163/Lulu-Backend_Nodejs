import {define} from "typeorm-seeding";
import {faker} from "@faker-js/faker";
import {Payment} from "../../entity/Payment";
import {PaymentType} from "../../entity/PaymentType";
import {PaymentStatus} from "../../entity/PaymentStatus";
import {Order} from "../../entity/Order";

let index:number = 1

define(Payment, () => {
    const payment = new Payment()

    payment.paymentId = index
    payment.payment_type = <PaymentType><unknown>faker.datatype.number({min:1, max:2})
    payment.payment_status = <PaymentStatus><unknown>faker.datatype.number({min: 1, max: 3})
    payment.order = <Order><unknown>index++
    payment.payment_amount = faker.datatype.number({min: 1000, max: 8000, precision: 0.01})
    payment.first_name = faker.name.firstName()
    payment.last_name = faker.name.lastName()
    payment.address = faker.address.streetAddress()
    payment.city = faker.address.cityName()
    payment.province = faker.address.state()
    payment.country = faker.address.country()
    payment.postcode = faker.address.zipCode('######')
    payment.phone = faker.phone.number('###-###-####')

    return payment
})