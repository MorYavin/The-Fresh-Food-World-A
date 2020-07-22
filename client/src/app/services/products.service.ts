import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product-model';
import { CategoryModel } from '../models/category-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${environment.server}/api/products`);
  }
  public getProductByName(productName: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${environment.server}/api/products/search/` +productName);
  }
  
  public getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${environment.server}/api/products/categories`);
  }  
  public getProductsByCategory(categoryId:string):Observable<CategoryModel>{
    return this.http.get<CategoryModel>(`${environment.server}/api/products/category/` +categoryId);
  }


}
