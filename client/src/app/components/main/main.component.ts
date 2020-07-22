import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public user: UserModel;

  constructor(private myAuthService: AuthService, private myRouter: Router) { }
  public display = true;
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
        })
    }
  }
  public toggleCart(){
    this.display=!this.display;
  }
}
