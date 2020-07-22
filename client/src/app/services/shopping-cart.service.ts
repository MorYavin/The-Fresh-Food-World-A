import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemsInCartModel } from '../models/items-in-cart-model';
import { ShoppingCartModel } from '../models/shopping-cart-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  public myApi = `${environment.server}/api/shopping/`;
  constructor(private http: HttpClient) { }

  public newCart(customerId: any) {
    return this.http.post(`${environment.server}/api/cart/new-cart`,{body: customerId}, customerId);
  }
  public getCartByCutomer(customerId:any){
    return this.http.get<ShoppingCartModel[]>(`${environment.server}/api/cart/${customerId}`);

  }
  public getCartDateCreated(_id:any){
    return this.http.get<ShoppingCartModel>(`${environment.server}/api/cart/cart-deatils/${_id}`);

  }
  public getAllProductsInCart(cartId: string): Observable<ShoppingCartModel> {
    return this.http.get<ShoppingCartModel>(`${environment.server}/api/cart/get-all-products-in-cart/${cartId}`);
  }

  public addProductToCart(product: ItemsInCartModel): Observable<ItemsInCartModel> {
    return this.http.post<ItemsInCartModel>(`${environment.server}/api/cart/add-product-to-cart`, product);
  }
  public updateProductInCart(product: ItemsInCartModel): Observable<ItemsInCartModel> {
    return this.http.put<ItemsInCartModel>(`${environment.server}/api/cart/update-product-in-cart`, product);
  }
  public deleteProductFromCart(_id: string) {
    return this.http.delete(`${environment.server}/api/cart/delete-product-from-cart/` + _id);
  }
  public clearCart(_id: string) {
    return this.http.put(`${environment.server}/cart/clear-cart/`+_id,[]);
  }
}
