import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/api/v1"

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * obtener todos los productos
   */
  getProducts() {
    const endpoint = `${ base_url}/products`;
    return this.http.get(endpoint);
  }

  /**
   * Guardar el producto
   */
  saveProduct(body: any) {
    const endpoint = `${ base_url}/products`;
    return this.http.post(endpoint, body);
  }


}
