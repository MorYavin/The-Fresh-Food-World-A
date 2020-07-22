import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-model';
import { store } from 'src/app/redux/store';
import { ActionType } from 'src/app/redux/action-type';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user: UserModel;
  public cartStatus : string;
  public credentials = { emailAddress: '', customerId: '' };
  public newUser: UserModel;
  public isEmpty: boolean = false;
  public warning: string = "";
  public stageOne: boolean = false;
  public cityHasError: boolean = false;
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
 

  constructor(private myAuthService:AuthService, private myRouter:Router, private myShoppingCartService:ShoppingCartService) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (store.getState().user !== null && store.getState().user.customerId !== undefined) { this.myRouter.navigateByUrl("/"); return; }
    }, 100);
  }
  
  // Moving to the second form 
  public continueRegisteration(form1: NgForm) {
    this.credentials.customerId=form1.controls.customerId.value;
    this.credentials.emailAddress=form1.controls.email.value;
    this.myAuthService.checkFirstForm(this.credentials)
    .subscribe(res=>{
    if (res==="Email already Exists"){
      alert(res);
      this.stageOne=false;
      return;
    } else if (res && res==="ID already exists"){
      alert(res);
      this.stageOne=false;
      return;
    }
    })
    
    if (!form1.valid) {
      this.isEmpty = true;
      this.warning = "Please fill all required fields";
    }
    if (
      form1.controls.password.value !== form1.controls.password2.value &&
      form1.controls.password &&
      form1.controls.password2
    ) {
      this.isEmpty = true;
      this.warning = "Passwords do not match";
    }
    if (form1.controls.password.value == form1.controls.password2.value && form1.valid) {
      this.isEmpty = false;
      this.stageOne = true;
      let newUser = new UserModel();
      newUser.emailAddress=form1.controls.email.value;
      newUser.password=form1.controls.password.value;
      newUser.customerId=form1.controls.customerId.value;
      this.newUser=newUser;
    }
  }

  // Validate city 
  validateCity(value) {
    if (value === "default") this.cityHasError = true;
    else this.cityHasError = false;
  }

  // Register
  onRegisterUser(form2: NgForm) {
    if (!form2.valid) {
      this.isEmpty = true;
      if (form2.controls.city.value == "") this.warning = "City field is required";
      else this.warning = "Please fill all required fields";
    } else {
      this.isEmpty = false;
      this.newUser.firstName=form2.controls.firstName.value,
      this.newUser.lastName=form2.controls.lastName.value,
      this.newUser.cityOfResidence=form2.controls.city.value,
      this.newUser.streetOfResidence=form2.controls.street.value,
      this.myAuthService.addUser(this.newUser).subscribe(
        res => {
          localStorage.setItem('token', res.jwtToken);
          store.dispatch({ type: ActionType.userLogin, payload: res.user });
          this.myShoppingCartService.newCart(res.user._id).subscribe(res=>{console.log("new cart RES: "  + JSON.stringify(res))})
          store.dispatch({ type: ActionType.updateCartStatus, payload: "active" });
          this.myRouter.navigateByUrl("/home");
        },
        err => {
          if (err.status) {
            this.isEmpty = true;
            this.warning = "Could not register user";
            this.myRouter.navigate(["/register"]);
          } 
        }
      );
    }
  }
}
