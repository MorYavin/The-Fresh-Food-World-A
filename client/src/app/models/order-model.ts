export class OrderModel {
    public constructor(
        public _id?:string,
        public customerId?:string,
        public cartId?:string,
        public totalOrderPrice?:number,
        public cityForDelivery?:string,
        public streetForDelivery?:string,
        public dateOfDelivery?: string,
        public orderDate?: string ,
        public creditCardDigits?:string
    ){}
}