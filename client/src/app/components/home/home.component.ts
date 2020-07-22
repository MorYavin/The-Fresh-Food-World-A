import { Component, OnInit, ɵConsole } from '@angular/core';
import { store } from 'src/app/redux/store';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActionType } from 'src/app/redux/action-type';
import { UserModel } from "src/app/models/user-model";
import { ProductsService } from 'src/app/services/products.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ItemsInCartModel } from "src/app/models/items-in-cart-model";
import { ShoppingCartModel } from "src/app/models/shopping-cart-model";
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  // User login checks
  public isAuth: boolean = false;
  public warning: string = "";
  public loginForm = { email: '', password: '' };
  public user: UserModel;
  public activeCartId: string;
  public isLoggedIn: boolean;
  // For last order modal
  public userLastOrder: string = "";
  public lastOrderItems: ItemsInCartModel[];
  public lastOrderTotal: number;
  public modalOptions: NgbModalOptions;
  public closeResult: string;
  // General site stats
  public productsTotalSum: number = 0;
  public ordersTotal: number = 0;
  public userLastOrderId: string;
  // User shopping cart status
  public totalCartValue: number;
  public cartStatus: string = "";
  public dateCreated: string;
  public itemsInCart: ItemsInCartModel[];
  public cart: ShoppingCartModel[];
  public newCart: any;
  public cartStatusPending: boolean;
  public cartIsEmpty: boolean;

  constructor(private myAuthService: AuthService, private modalService: NgbModal, private myRouter: Router, private myShoppingCartService: ShoppingCartService, private myProductsService: ProductsService, private myOrdersService: OrdersService) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.user = store.getState().user;
      this.cartStatus = store.getState().cartStatus;
      this.dateCreated = store.getState().dateCreated;
      this.totalCartValue = store.getState().totalCartValue;
    });

    // Check if user is logged in
    if (!this.user) {
      this.myAuthService.isLoggedIn()
        .subscribe(res => {
          if (res.name === 'JsonWebTokenError') {
            return;
          } 
          store.dispatch({ type: ActionType.userLogin, payload: res.user });
          if (res.user.role !== "admin") {
            this.myOrdersService.getOrdersByUser(res.user._id)
              .subscribe(res => {
                // If user has recently registered and hasn't placed any orders yet 
                if (res == null) {
                  this.userLastOrder += "none";
                  this.myShoppingCartService.getCartByCutomer(this.user._id)
                    .subscribe(res => {
                      if ((res[res.length - 1].status == "active")) {
                        this.cartStatus = "active";
                        this.cartStatusPending = true;
                        this.dateCreated = res[res.length - 1].dateCreated;
                        this.getToatlCartValue(res[res.length - 1]._id);
                      }
                    })
                }
                else {
                  // check if user has an active cart 
                  this.userLastOrder = res[(res.length - 1)].orderDate;
                  this.userLastOrderId = res[(res.length - 1)]._id;
                  this.myShoppingCartService.getCartByCutomer(this.user._id)
                    .subscribe(res => {
                      if (res[res.length - 1].status == "active") {
                        this.cartStatus = "active";
                        this.cartStatusPending = true;
                        this.dateCreated = res[res.length - 1].dateCreated;
                        this.getToatlCartValue(res[res.length - 1]._id);
                        if (this.totalCartValue > 0) { this.cartIsEmpty = false }
                      }
                    });
                }
              }, err => alert(err.message))
          }
        }, err => alert(err.message));
    }

    // Check if user has an active cart. If not - create one.
    const localCart = localStorage.getItem("myCart");
    if (!this.cart && !localCart) {
      if (this.user) {
        this.newCart();
      }
    }

    // Recieve general site stats about products and orders.
    this.myProductsService.getAllProducts()
      .subscribe(res => this.productsTotalSum = res.length, err => alert(err.message));
    this.myOrdersService.getAllOrders()
      .subscribe(res => this.ordersTotal = res.length, err => alert(err.message));

  }


  public login(): void {
    this.myAuthService.login(this.loginForm)
      .subscribe(res => {
        if (!res.user) {
          alert('Wrong email or password, please check');
          return;
        }
        store.dispatch({ type: ActionType.userLogin, payload: res.user });
        localStorage.setItem('token', res.jwtToken);
        if (res.user.role === "admin") {
          this.myRouter.navigateByUrl("/admin");
          return;
        }
        setTimeout(() => {
          location.reload();
        }, 500);
      }, err => alert(err.message));
  }

  // ------------ Details of user stats (yellow box) ------- //
  // Show last Order
  public showLastOrder(cartId) {
    let total = 0;
    this.myOrdersService.getOrdersByOrderId(this.userLastOrderId)
      .subscribe(res => {
        this.myShoppingCartService.getAllProductsInCart(res[0].cartId)
          .subscribe(res => {
            this.lastOrderItems = res[0].itemsInCart; res[0].itemsInCart.forEach(element => {
              total += element.totalCartValue;
            })
            this.lastOrderTotal = total;
          })
      });
    document.getElementById("openModalBtn").click();
  }

  // Get Items in user's RECENT cart
  public getItemsByCartId(activeCartId) {
    this.myShoppingCartService.getAllProductsInCart(this.activeCartId).toPromise().then(
      res => {
        this.itemsInCart = res[0].itemsInCart;
      })
  }

  // Get value of RECENT cart
  getToatlCartValue(activeCartId) {
    let total = 0;
    this.myShoppingCartService.getAllProductsInCart(activeCartId).toPromise().then(
      res => {
        res[0].itemsInCart.forEach(element => {
          total += element.totalCartValue;
        })
        this.totalCartValue = total;
        if (this.totalCartValue == 0) { this.cartIsEmpty = true }
        return this.totalCartValue;
      });
  }

  // ------------ Last order modal ---------- // 
  public open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
