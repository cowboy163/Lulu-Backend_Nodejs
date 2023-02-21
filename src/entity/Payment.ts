import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import {Length, Max, Min} from "class-validator";
import {Order} from "./Order";
import {PaymentType} from "./PaymentType";
import {PaymentStatus} from "./PaymentStatus";

@Entity()

@Unique(["order"])

export class Payment {
    @PrimaryGeneratedColumn()
    paymentId: number

    @ManyToOne(() => PaymentType, paymentType => paymentType.payments)
    payment_type: PaymentType

    @ManyToOne(() => PaymentStatus, paymentStatus => paymentStatus.payments)
    payment_status: PaymentStatus

    @OneToOne(() => Order)
    @JoinColumn()
    order: Order

    @Column('decimal', {precision: 7, scale: 2, nullable: false})
    @Min(0)
    payment_amount: number

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

    @Column({nullable: true, default: false})
    isActive: boolean

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date
}

