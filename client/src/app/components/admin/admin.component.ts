import { Component, OnInit} from '@angular/core';
import { store } from 'src/app/redux/store';
import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { ActionType } from 'src/app/redux/action-type';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryModel } from 'src/app/models/category-model';
import { ProductModel } from 'src/app/models/product-model';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public user: UserModel;
  public categories: CategoryModel[];
  public newCategory = new CategoryModel();
  public products: ProductModel[];
  public categorySelected: boolean;
  public term: string = "";
  public productImage: string;
  // Edit & Add modal
  public display: string = "none";
  public modalHeader: string = "";
  public modalBody: string = "";
  public modalOptions: NgbModalOptions;
  public closeResult: string;
  public product: ProductModel = new ProductModel();
  public selectedFile: any = null;
  public isFileSelected: boolean = false;
  public isEmpty: boolean = false;
  public warning: string = "";
  public selectedCategory: string;
  public productToEdit: boolean;

  constructor(private myProductsService: ProductsService, private myAdminService: AdminService, private modalService: NgbModal, private myAuthService: AuthService, private myRouter: Router) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.user = store.getState().user;
    });
    if (!this.user) {
      this.myAuthService.isLoggedIn()
        .subscribe(res => {
          if (res.name === 'JsonWebTokenError') {
            alert("You don't have access to this page");
            this.myRouter.navigateByUrl("/home");
          }
          store.dispatch({ type: ActionType.userLogin, payload: res.user });
          if (this.user.role === "user") {
            alert("You don't have access to this page");
            this.myRouter.navigateByUrl("/home");
          }
        })
    }
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

  // Search product
  public onSearch(productName): void {
    this.myProductsService.getProductByName(productName)
      .subscribe(res => {
        this.products = res;
      }, err => alert(err.message));
  }
  // Select Category
  public selectCategory(_id) {
    this.myProductsService.getProductsByCategory(_id)
      .subscribe
      (res => { this.products = res[0].products, this.categorySelected = true },
        err => alert(err.message))
  }

  // Show All Products
  public showAllProducts() {
    this.myProductsService.getAllProducts()
      .subscribe
      (products => { (this.products = products), this.categorySelected = false },
        err => alert(err.message))
  }


  // ----------- Modal functions ------------- // 
  // open modal
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

  // ------------ Edit product functions ---------- //
  // Open edit panel
  public toggleEdit(product) {
    this.productToEdit = true;
    const findProduct = this.products.find(p => p._id === product._id);
    this.product = findProduct;
    this.display = "block";
  }

  // Edit product
  public editProduct() {
    if (this.product.productPrice == null) {
      alert("Product price is required");
      return;
    } else if (!this.product.productImage) {
      alert("Product image is required");
      return;
    }
    const fd: FormData = new FormData();
    fd.append('image', this.product.productImage);
    fd.append('product', JSON.stringify(this.product));
    this.myAdminService.updateProduct(fd)
      .subscribe(res => {
        const index = this.products.findIndex(p => p._id === res._id);
        this.products[index] = res;
        alert('product has been successfuly updated');
        this.display = "none";
      }, err => alert(err.message))
  }

  // Update Image
  public updateImg(event: any): void {
    this.selectedFile = event.target.files[0];
    if (
      this.selectedFile.type !== "image/jpeg" &&
      this.selectedFile !== "image/jpg" &&
      this.selectedFile !== "image/png"
    ) { alert("please uplpoad only valid image files") }
    else {
      this.product.productImage = this.selectedFile;
    }
  }

  // Cancel edit
  public cancelEdit() {
    this.display = "none";
    location.reload();
  }

  // ---------------- Add functions -------------- //
  // Add product
  public addProduct() {
    const fd: FormData = new FormData();
    if (!this.product.productName) {
      alert("Product Name is required");
      return;
    } else if (!this.product.productImage) {
      alert("Prodcut Image is required");
      return;
    } else if (!this.product.productPrice) {
      alert("Product Price is required");
      return;
    } else if (!this.product.productCategory) {
      alert("Product Category is required");
      return;
    }
    fd.append('image', this.product.productImage);
    fd.append('product', JSON.stringify(this.product));
    this.myAdminService.addProduct(fd)
      .subscribe(res => {
        this.products.push(res);
        alert('product has been successfuly added');
        this.display = "none";
      }, err => alert(err.message))
  }

  // Add category 
  public category(): void {
    if (this.newCategory.categoryName == undefined) {
      alert("Category Name is required");
      return;
    } else if (this.newCategory.categoryName.length < 2) {
      alert("Category Name has to be at least 2 characters long");
      return;
    }
    this.myAdminService.addCategory(this.newCategory)
      .subscribe(res => { this.categories.push(res) })
    document.getElementById("addCategoryClose").click();
  }
}
