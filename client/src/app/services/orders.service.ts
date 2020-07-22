import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/order-model';
import { Router } from '@angular/router';
import {saveAs} from "file-saver";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public filePath:string;
  constructor(private http: HttpClient, private router:Router) { }

  public addOrder(order: OrderModel): Observable<any> {
    return this.http.post<OrderModel>(`${environment.server}/api/orders/`, order);
  }
  public getAllOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${environment.server}/api/orders/all-orders`);
  }
  
  public getOrdersByUser(_id:string):Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${environment.server}/api/orders/`+_id);
  }
  public getOrdersByOrderId(_id:string):Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${environment.server}/api/orders/last-order/`+_id);
  }

public receiptDownload(route: string, filename: string = null): void{

  const baseUrl = `${environment.server}/api/orders/receipts`;
  const headers = new HttpHeaders( { 'Content-Disposition': 'attachment'});
  this.http.get(baseUrl + route,{headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) =>{
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          if (filename)
              downloadLink.setAttribute('download',filename);
              downloadLink.download="receipt.txt";
          saveAs(downloadLink.href,"receipt.txt");
      }
  )
}

  public updateCartStatus(cart:any,cartId:string){
    return this.http.put<any>(`${environment.server}/api/orders/update-cart/`+cartId, cart);
  }


}


