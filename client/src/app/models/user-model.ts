import { ShoppingCartModel } from './shopping-cart-model';
import { ItemsInCartModel } from './items-in-cart-model';

export class UserModel {
  jwtToken(arg0: string, jwtToken: any) {
    throw new Error("Method not implemented.");
  }
    userId: any;
  user: any;
    public constructor(
        public _id?:string,
        public customerId?: string,
        public emailAddress?: string,
        public firstName?: string,
        public lastName?: string,
        public password?: string,
        public cityOfResidence?: string,
        public streetOfResidence?: string,
        public role?: string,
        public shoppingCarts?: ShoppingCartModel


    ) { }
}