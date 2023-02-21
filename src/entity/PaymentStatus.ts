import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {Length} from "class-validator";
import {Payment} from "./Payment";
import {Order} from "./Order";

@Entity()

@Unique(['payment_status'])

export class PaymentStatus {
    @PrimaryGeneratedColumn()
    paymentStatusId: number

    @Column()
    @Length(1, 10)
    payment_status: string

    @OneToMany(() => Payment, payment => payment)
    payments: Order[]

    @Column({nullable: false, default: true})
    isActive: boolean

    @Column({nullable: false, default: false})
    isDelete: boolean

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date
}