import { ItemsInCartModel } from './items-in-cart-model';

export class ShoppingCartModel {
    public constructor(
        public _id?: string,
        public customerId?: string,
        public dateCreated?: string,
        public status?:string,
        public itemsInCart?: ItemsInCartModel

    ) { }
}