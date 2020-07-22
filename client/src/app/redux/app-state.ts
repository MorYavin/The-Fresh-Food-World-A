import { ItemsInCartModel} from '../models/items-in-cart-model';
import {UserModel} from "../models/user-model";
export class AppState {

    public user: UserModel;
    public ItemsInCart: ItemsInCartModel[];
    public totalCartValue: number;
    public cartStatus: string;
    public dateCreated:string;
    public isLoggedIn: boolean;
    public isAdmin:boolean;

    public constructor() {
        this.user = null;
        this.ItemsInCart = [];
        this.totalCartValue = 0;
        this.cartStatus = "";
        this.dateCreated = "";
        this.isLoggedIn = false;
        this.isAdmin = false;
    }
}
