import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { UserModel } from 'src/app/models/user-model';
import { ItemsInCartModel } from 'src/app/models/items-in-cart-model';
import { AuthService } from 'src/app/services/auth.service';
import { ActionType } from 'src/app/redux/action-type';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderModel } from 'src/app/models/order-model';
import { OrdersService } from 'src/app/services/orders.service';
import { ShoppingCartModel } from 'src/app/models/shopping-cart-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  form: any;

  constructor(private modalService: NgbModal, private myAuthService: AuthService, private myOrdersService: OrdersService, private myShoppingCartService: ShoppingCartService, private myRouter: Router) { }
  public user: UserModel;
  public activeCartId: string;
  public cartStatus: string;
  public cartCreationDate: string;
  public itemsInCart: ItemsInCartModel[] = [];
  public order: OrderModel = new OrderModel();
  public totalCartValue: number;
  public orders: OrderModel[];
  public count = 0;
  public last = "";
  // Order Form details
  public display = true;
  public orderFormOpen: string = "true";
  public userAddress: string;
  public userCity: string;
  public currentDate: string = "";
  public shippingDates: any[] = [];
  public filePath: string = '';
  public path: string = 'http://localhost:3000/api/orders/receipts/';
  public closeResult = '';
  public dateTaken: boolean;
  public cities: Array<String> = [
    "Jerusalem",
    "Tel-Aviv",
    "Haifa",
    "Rishon LeZiyyon",
    "Nahariyah",
    "Petah Tikva",
    "Beer-Sheva",
    "Ashdod",
    "Holon",
    "Eilat"
  ];

  ngOnInit(): void {

    store.subscribe(() => {
      this.user = store.getState().user;
      this.cartStatus = store.getState().cartStatus;
      this.itemsInCart = store.getState().ItemsInCart;
    });

    if (!this.user) {
      this.myAuthService.isLoggedIn()
        .subscribe(res => {
          if (res.name === 'JsonWebTokenError') {
            return;
          }
          store.dispatch({ type: ActionType.userLogin, payload: res.user });
          this.myShoppingCartService.getCartByCutomer(res.user._id)
            .subscribe(res => {
              this.activeCartId = (res[res.length - 1]._id);
              this.getToatlCartValue(this.activeCartId);
              this.getItemsByCartId(this.activeCartId);
              this.myShoppingCartService.getCartDateCreated(this.activeCartId)
                .subscribe(res => { this.cartCreationDate = res[0].dateCreated;  })
            });
        }, err => alert(err.message));
    }
  }

  //--------- Shopping Cart deatils --------------//
  // Get cart total value 
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
  // Get items in cart
  public getItemsByCartId(activeCartId) {
    this.myShoppingCartService.getAllProductsInCart(this.activeCartId).toPromise().then(
      res => {
        this.itemsInCart = res[0].itemsInCart;
      }
    )
  }
  // Open / close cart view
  public toggleCart() {
    this.display = !this.display;
  }

  //---------- Order Form ------------//
  // Double click to get city
  public getCity(form) {
    const value = this.user.cityOfResidence;
    this.userCity = value;
    form.controls.city.setValue(value);
  }
  // Double click to get street
  public getAddress(form) {
    const value = this.user.streetOfResidence;
    this.userAddress = value;
    form.controls.street.setValue(value);
  }
  // Set minimum date on calander (can't be earlier than today)
  public getCurrentDate() {
    let today = new Date(),
    current = today.getFullYear().toString();
    if (today.getMonth() + 1 < 10) current += "-0" + (today.getMonth() + 1);
    else current += "-" + (today.getMonth() + 1);
    if (today.getDate() < 10) current += "-0" + today.getDate();
    else current += "-" + today.getDate();
    return current;
  };
  // Check date availability 
  public getAllOrders(): void {
    let tmpArrCount = [];
    let chosenDate; let index; let counter;
    this.myOrdersService.getAllOrders()
      .subscribe(res => {
        res.map(order => {
          const existingDates = new Date(order.dateOfDelivery).toLocaleDateString();
          chosenDate = new Date(this.order.dateOfDelivery).toLocaleDateString();
          tmpArrCount.push(existingDates);
          counter = {};
          tmpArrCount.forEach(function (x) { counter[x] = (counter[x] || 0) + 1; })
          index = tmpArrCount.indexOf(chosenDate)
          return;
        })
        if ((index >= 0) && (counter[chosenDate] >= 3)) {
          alert("Sorry, this date is already fully booked, please pick another one");
          this.dateTaken = true;
          return
        };
        this.dateTaken = false;
      }, err => alert(err.message));

  }

  // --------- Place order + Receipt --------//
  // Place order
  public placeOrder(): void {
    this.getToatlCartValue(this.activeCartId)
    this.order.cartId = this.activeCartId;
    this.order.creditCardDigits = this.order.creditCardDigits.substr(this.order.creditCardDigits.length - 4);
    this.order.customerId = this.user._id;
    this.order.totalOrderPrice = this.totalCartValue;
    this.myOrdersService.addOrder(this.order)
      .subscribe(res => { this.filePath = res.file, this.updateCartStatus(this.activeCartId) }, err => alert(err.message));
    document.getElementById("openModalBtn").click();
    this.myShoppingCartService.newCart(this.user._id).subscribe(res => {return res})
    this.myRouter.navigateByUrl("/home");
  }
  // Open receipt modal 
  public open(content) {
    this.modalService.open(content)
  }
  // Download receipt
  public receiptDownload(filePath: string) {
    this.myOrdersService.receiptDownload(this.filePath);
    document.getElementById("closeBtn").click();
  }
  // Close modal and go to home page
  public finishAndGoHome() {
    document.getElementById("closeBtn").click();
    this.myRouter.navigateByUrl("/home");
  }
  // Update cart after placing order
  public updateCartStatus(_id: string) {
    const cartToUpdate = new ShoppingCartModel();
    cartToUpdate._id = _id;
    cartToUpdate.dateCreated = this.cartCreationDate;
    cartToUpdate.customerId = this.user._id;
    cartToUpdate.status = "closed";
    this.myOrdersService.updateCartStatus(cartToUpdate, _id)
      .subscribe(res => {
        store.dispatch({ type: ActionType.updateCartStatus, payload: "closed" });
      }, err => alert(err.message));

  }


}
