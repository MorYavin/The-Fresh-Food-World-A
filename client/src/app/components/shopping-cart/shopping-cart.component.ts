import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { store } from 'src/app/redux/store';
import { ActionType } from 'src/app/redux/action-type';
import { ItemsInCartModel } from 'src/app/models/items-in-cart-model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ProductModel } from 'src/app/models/product-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  public isSidenavOpen: boolean = true;
  public activeCartId: string;
  public user: UserModel;
  public display: string = "none";
  public modalHeader: string = "";
  public modalBody: string = "";
  public itemsInCart: ItemsInCartModel[] = [];
  public itemInCart: ItemsInCartModel;
  public products: ProductModel;
  public totalCartValue: number;
  public cartStatus: string = "active";
  public orderFormOpen: string = "false";
  public filteredStatus: string = "";

  constructor(private myAuthService: AuthService, public router: Router, private myShoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.user = store.getState().user;
      this.itemsInCart = store.getState().ItemsInCart;
      this.totalCartValue = store.getState().totalCartValue;
    });

    if (!this.user) {
      this.myAuthService.isLoggedIn()
        .subscribe(res => {
          if (res.name === 'JsonWebTokenError') {
            return;
          }
          this.myShoppingCartService.getCartByCutomer(res.user._id)
            .subscribe(res => {
              this.activeCartId = (res[res.length - 1]._id);
              this.getToatlCartValue(this.activeCartId);
              this.getItemsByCartId(this.activeCartId);
            });
          store.dispatch({ type: ActionType.userLogin, payload: res.user });
        }, err => alert(err.message));
    }
  }
  getToatlCartValue(activeCartId) {
    let total = 0;
    this.myShoppingCartService.getAllProductsInCart(this.activeCartId).toPromise().then(
      res => {
        res[0].itemsInCart.forEach(element => {
          total += element.totalCartValue;
        })
        this.totalCartValue = total;
        return this.totalCartValue;
      }
    );
  }

  // Get items in current cart
  public getItemsByCartId(activeCartId) {
    this.myShoppingCartService.getAllProductsInCart(this.activeCartId).toPromise().then(
      res => {
        this.itemsInCart = res[0].itemsInCart;
      }
    )
  }
  // Remove product from cart
  public removeProductFromCart(_id: string) {
    this.myShoppingCartService.deleteProductFromCart(_id)
      .subscribe(res => {
        store.dispatch({ type: ActionType.removeFromCart, payload: _id });
      }, err => alert(err.message));
    setTimeout(() => {
      const mewTotalValue = this.getToatlCartValue(this.activeCartId);
      store.dispatch({ type: ActionType.updateTotalCartValue, payload: mewTotalValue });
      this.getItemsByCartId(this.activeCartId);

    }, 100);
  }
  // Decrease product amount by 1
  public decreaseAmount(_id: string) {
    const index = this.itemsInCart.findIndex(p => p.productId === _id);
    this.itemsInCart[index].quantity -= 1;
    this.itemsInCart[index].totalCartValue -= this.itemsInCart[index].products.productPrice;
    const productToUpdate = new ItemsInCartModel();
    productToUpdate._id = this.itemsInCart[index]._id;
    productToUpdate.productId = this.itemsInCart[index].productId;
    productToUpdate.quantity = this.itemsInCart[index].quantity;
    productToUpdate.totalCartValue = this.itemsInCart[index].totalCartValue;
    productToUpdate.cartId = this.activeCartId;
    this.myShoppingCartService.updateProductInCart(productToUpdate)
      .subscribe(res => {
        store.dispatch({ type: ActionType.updateProduct, payload: res });
      }, err => alert(err.message));
    setTimeout(() => {
      const mewTotalValue = this.getToatlCartValue(this.activeCartId);
      store.dispatch({ type: ActionType.updateTotalCartValue, payload: mewTotalValue });
      this.getItemsByCartId(this.activeCartId);

    }, 100);
  }
  // Increase product amount by 1
  public increaseAmount(_id: string) {
    const index = this.itemsInCart.findIndex(p => p.productId === _id);
    this.itemsInCart[index].quantity += 1;
    this.itemsInCart[index].totalCartValue += this.itemsInCart[index].products.productPrice;
    const productToUpdate = new ItemsInCartModel();
    productToUpdate._id = this.itemsInCart[index]._id;
    productToUpdate.productId = this.itemsInCart[index].productId;
    productToUpdate.quantity = this.itemsInCart[index].quantity;
    productToUpdate.totalCartValue = this.itemsInCart[index].quantity;
    productToUpdate.productName = this.itemsInCart[index].productName;
    productToUpdate.cartId = this.activeCartId;
    this.myShoppingCartService.updateProductInCart(productToUpdate)
      .subscribe(res => {
        store.dispatch({ type: ActionType.updateProduct, payload: res });
      }, err => alert(err.message));
    setTimeout(() => {
      const mewTotalValue = this.getToatlCartValue(this.activeCartId);
      store.dispatch({ type: ActionType.updateTotalCartValue, payload: mewTotalValue });
      this.getItemsByCartId(this.activeCartId);

    }, 100);
  }
  // Remove all products from cart
  public clearCart() {
    const answer = window.confirm("Are you sure you want to clear your cart?");
    if (!answer) {
      return;
    }
    this.myShoppingCartService.clearCart(this.activeCartId)
      .subscribe(res => {
        this.itemsInCart=[];
      }, err => alert(err.message));
  }
}