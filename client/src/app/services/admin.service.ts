import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
 
  public addCategory(categoryName: any) {
    return this.http.post<any>(`${environment.server}/api/admin/add-category`, categoryName);
  }
  public addProduct(product: any) {
    return this.http.post<any>(`${environment.server}/api/admin/add-product`, product);
  }
  public updateProduct(product:any){
    return this.http.put<any>(`${environment.server}/api/admin/update-product`, product);
  }
}
