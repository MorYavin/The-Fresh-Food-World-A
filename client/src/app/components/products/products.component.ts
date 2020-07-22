import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ProductModel } from 'src/app/models/product-model';
import { CategoryModel } from 'src/app/models/category-model';
import { store } from 'src/app/redux/store';
import { UserModel } from "src/app/models/user-model";
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ItemsInCartModel } from 'src/app/models/items-in-cart-model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ActionType } from 'src/app/redux/action-type';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  // Products Categories
  public fruitsProducs: ProductModel[] = [];
  public poultryAndMeatProducs: ProductModel[] = [];
  public vegetablesProducs: ProductModel[] = [];
  public drinksProducs: ProductModel[] = [];
  public bakedGoodsProduct: ProductModel[] = [];
  // Products and user details
  public productName: string;
  public categories: CategoryModel[];
  public products: ProductModel[];
  public itemsInCart: ItemsInCartModel[] = [];
  public totalCartValue: number;
  public activeCartId: string;
  public user: UserModel;
  public isLoggedIn: boolean;
  public cartStatus: string;
  public term: string = "";
  public categorySelected: boolean;
  // Add Product Modal 
  public display: string = "none";
  public modalHeader: string = "";
  public modalBody: string = "";
  public modalOptions: NgbModalOptions;
  public closeResult: string;

  constructor(private myProductsService: ProductsService, private myAuthService: AuthService, private modalService: NgbModal, private myShoppingCartService: ShoppingCartService, private myRouter: Router) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.user = store.getState().user;
      this.cartStatus = store.getState().cartStatus;
      this.itemsInCart = store.getState().ItemsInCart;
      this.totalCartValue = store.getState().totalCartValue;
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
            });
        }, err => alert(err.message));
    }

    this.myProductsService.getAllProducts()
      .subscribe(res => {
        res.map(product => {
          if (product.productCategory === "Fruits") { this.fruitsProducs.push(product); }
          if (product.productCategory === "Poultry") { this.poultryAndMeatProducs.push(product); }
          if (product.productCategory === "Vegetables") { this.vegetablesProducs.push(product); }
          if (product.productCategory === "Drinks") { this.drinksProducs.push(product); }
          if (product.productCategory === "baked goods") { this.bakedGoodsProduct.push(product); }
        });
      }, err => alert(err.message));

    // Get All Products
    this.myProductsService.getAllProducts()
      .subscribe
      (products => { (this.products = products) },
        err => alert(err.message))

    // Get All Catgories
    this.myProductsService.getAllCategories()
      .subscribe
      (categories => { (this.categories = categories) },
        err => alert(err.message))

  }
  // ---------- Main - all categories and products cards --------//
  // Search product
  public onSearch(productName): void {
    this.myProductsService.getProductByName(productName)
      .subscribe(res => {
      }, err => alert(err.message));
  }
  // Show specific category
  public selectCategory(_id) {
    this.myProductsService.getProductsByCategory(_id)
      .subscribe
      (res => { this.products = res[0].products, this.categorySelected = true },
        err => alert(err.message))
  }
  // Show all products
  public showAllProducts() {
    this.myProductsService.getAllProducts()
      .subscribe
      (products => { (this.products = products), this.categorySelected = false },
        err => alert(err.message))
  }
  // Get items in current cart
  public getItemsByCartId(activeCartId) {
    this.myShoppingCartService.getAllProductsInCart(this.activeCartId).toPromise().then(
      res => {
        this.itemsInCart = res[0].itemsInCart;
      }
    )
  }

  // Add/update selected product
  public addProductToCart(product): void {
    if (product.productQuantity == undefined) {
      alert("please choose quantity");
      return;
    }
    const index = this.itemsInCart.findIndex(p => p.productId === product._id);
    // if it exists - update quantity and total price
    if (index >= 0) {
      this.itemsInCart[index].quantity += product.productQuantity;
      this.itemsInCart[index].totalCartValue += (product.productPrice * product.productQuantity);
      const productToUpdate = new ItemsInCartModel();
      productToUpdate._id = this.itemsInCart[index]._id;
      productToUpdate.productId = this.itemsInCart[index].productId;
      productToUpdate.productName = product.productName;
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
      }, 100);
      document.getElementById("closeBtn").click();
      location.reload();
    }
    // if product doesn't exists - add it
    if (index < 0) {
      const productToUpdate = new ItemsInCartModel();
      productToUpdate.productId = product._id;
      productToUpdate.quantity = product.productQuantity;
      productToUpdate.totalCartValue = product.productPrice * product.productQuantity;
      productToUpdate.cartId = this.activeCartId;
      productToUpdate.productName = product.productName;

      this.myShoppingCartService.addProductToCart(productToUpdate)
        .subscribe(res => {
          store.dispatch({ type: ActionType.addProductToCart, payload: res });
        }), err => alert(err.message);
    }

    setTimeout(() => {
      const mewTotalValue = this.getToatlCartValue(this.activeCartId);
      store.dispatch({ type: ActionType.updateTotalCartValue, payload: mewTotalValue });
    }, 100);
    document.getElementById("closeBtn").click();
    location.reload();

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
      });
  }

  // ------- Add Product Modal functions ---------//
  open(content) {
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

  openModal() {
    this.display = "block";
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  onCloseHandled() {
    this.display = "none";
  }
  onError() {
    this.modalHeader = "An Error Has Occurred";
    this.modalBody = "Could not display products do to server communication problem. Please try again later.";
  }


}
