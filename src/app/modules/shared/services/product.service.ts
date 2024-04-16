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

  /**
   * Actualizar un producto
   */
  updateProduct(body: any, id: any) {
    const endpoint = `${ base_url}/products/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * Eliminar un producto
   */
  deleteProduct(id:any) {
    const endpoint = `${ base_url}/products/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * Buscar por nombre
   */
  getProductByName(name: any) {
    const endpoint = `${ base_url}/products/filter/${name}`;
    return this.http.get(endpoint);
  }

  /**
   * Exportar archivos excel de productos
   */
  exportProducts() {
    const endpoint = `${base_url}/products/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }


}
