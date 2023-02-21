import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {Length} from "class-validator";
import {Order} from "./Order";

@Entity()

@Unique(['order_status'])

export class OrderStatus {
    @PrimaryGeneratedColumn()
    orderStatusId: number

    @Column({nullable: false})
    @Length(1, 10)
    order_status: string

    @OneToMany(() => Order, order => order.order_status)
    orders: Order[]

    @Column({nullable: false, default: true})
    isActive: boolean

    @Column({nullable: false, default: false})
    isDelete: boolean

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date
}