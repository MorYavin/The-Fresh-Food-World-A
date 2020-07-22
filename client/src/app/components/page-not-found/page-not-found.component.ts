import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private myRouter:Router) { }

  ngOnInit(): void {
    setTimeout(() => {
     this.myRouter.navigateByUrl("/home");
    }, 3000);
  }

}
