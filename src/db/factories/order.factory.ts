import {define} from "typeorm-seeding";
import {Order} from "../../entity/Order";
import {faker} from "@faker-js/faker";
import {OrderStatus} from "../../entity/OrderStatus";

let index:number = 1

define(Order, () => {
    const order = new Order()

    let year:number = faker.datatype.number({min:2017, max: 2022})
    let month:number = faker.datatype.number({min:1, max:12})
    let day:number = faker.datatype.number({min:1, max:28})
    let hour:number = faker.datatype.number({min:0, max:23})
    let min:number = faker.datatype.number({min:0, max:59})
    let sec:number = faker.datatype.number({min:0, max:59})

    order.order_id = index++
    order.products = ["prod7390091|33984|S|1", "prod9000140|58320|L|1"]
    order.user = 1
    order.order_status = <OrderStatus><unknown>faker.datatype.number({min: 1, max: 4})
    order.price = faker.datatype.number({min: 100, max: 8000, precision: 0.01})
    order.tax_rate = 1.30
    order.total = Number((order.price * order.tax_rate).toFixed(2))
    order.first_name = "Mark"
    order.last_name = "Xu"
    order.address = faker.address.streetAddress()
    order.city = faker.address.cityName()
    order.province = faker.address.state()
    order.country = faker.address.country()
    order.postcode = faker.address.zipCode('######')
    order.phone = faker.phone.number('###-###-####')
    order.createdAt = new Date(year,month,day,hour,min,sec)

    return order
})