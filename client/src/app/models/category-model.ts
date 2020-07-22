import { ProductModel } from './product-model';

export class CategoryModel {
    public constructor(
        public _id?: string,
        public categoryName?: string,
        public products?:ProductModel
    ) { }
}