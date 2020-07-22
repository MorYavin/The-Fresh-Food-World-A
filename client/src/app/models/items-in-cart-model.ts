import { ProductModel } from './product-model';

export class ItemsInCartModel {
    public constructor(
        public _id?: string,
        public productId?: string,
        public productName?:string,
        public quantity?: number,
        public totalCartValue?: number,
        public cartId?: string,
        public products?:ProductModel
    ) { }
}