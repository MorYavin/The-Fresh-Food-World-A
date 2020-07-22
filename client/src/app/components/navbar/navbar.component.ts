import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { store } from 'src/app/redux/store';
import { AuthService } from 'src/app/services/auth.service';
import { ActionType } from 'src/app/redux/action-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: UserModel;
  isLoggedIn: boolean;
  isAdmin: boolean;


  constructor(private myAuthService: AuthService,private myRouter: Router) { }

  ngOnInit(): void {
    store.subscribe(() => {
      this.user = store.getState().user;
    
    });
    if (!this.user) {
      this.myAuthService.isLoggedIn()
        .subscribe(res => {
          if (res.name === 'JsonWebTokenError') {
            return;
          }
          const action = { type: ActionType.userLogin, payload: res.user };
          store.dispatch(action);
        }, err => alert(err.message));
    }
  }
  public logout(): void {
    store.dispatch({ type: ActionType.logout, payload: null });
    store.dispatch({ type: ActionType.updateCartStatus, payload: closed });
    localStorage.removeItem('token');
    this.myRouter.navigateByUrl("/");
  }
}
