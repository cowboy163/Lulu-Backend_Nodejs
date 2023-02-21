import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import {Payment} from "./Payment";
import {Length} from "class-validator";

@ Entity()

@Unique(['payment_type'])

export class PaymentType {
    @PrimaryGeneratedColumn()
    paymentTypeId: number

    @Column()
    @Length(1, 10)
    payment_type: string

    @OneToMany(() => Payment, payment => payment.payment_type)
    payments: Payment[]

    @Column({default: true, nullable: false})
    isActive: boolean

    @Column({default: false, nullable: false})
    isDelete: boolean

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date
}