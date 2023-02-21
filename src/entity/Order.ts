import {Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Length, Max, Min} from "class-validator";
import {OrderStatus} from "./OrderStatus";
import {Payment} from "./Payment";

@Entity()

export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column("simple-array")
    products: string[]
    // products: string

    @Column({nullable: false})
    user: number

    @ManyToOne( () => OrderStatus, orderStatus => orderStatus.orders)
    order_status: OrderStatus

    // @OneToOne( () => Payment, payment => payment.order )
    // payment: Payment

    @Column('decimal', {precision: 5, scale: 2, nullable: false})
    @Min(0)
    price: number

    @Column('decimal', {precision: 5, scale: 2})
    @Min(0)
    total: number

    @Column('decimal', {precision: 5, scale: 2, default: 1.00})
    @Min(1)
    tax_rate: number

    @Column()
    @Length(1,100)
    first_name: string;

    @Column()
    @Length(1,100)
    last_name: string;

    @Column()
    @Length(1,100)
    address: string;

    @Column({nullable: true, default: null})
    address_2: string;

    @Column()
    @Length(1,100)
    city: string;

    @Column()
    @Length(1,100)
    province: string;

    @Column()
    @Length(1,100)
    country: string;

    @Column()
    @Length(6,6)
    postcode: string;

    @Column()
    @Length(3, 20)
    phone: string;

    @Column({nullable: false, default: true})
    isActive: boolean

    @Column({nullable: false, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date
}