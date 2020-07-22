export class ProductModel {
    public constructor(
        public _id?:string,
        public productName?:string,
        public productCategory?:string,
        public productPrice?:number,
        public productQuantity?:number,
        public productImage?:string | File
    ){}
}