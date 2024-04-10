import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

const base_url = 'http://localhost:8080/api/v1';

//En los services se hace toda la logica de conexion hacia los distintos endpoints
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  /**
   * Esta libreria de angular (HttpClient) nos permite realizar las conexiones al endpoint mediante
  los diferentes metodos, ya sea get, post, put, delete, etc.
   */
  constructor( private http: HttpClient ) { }

  /**
    *Obtener todas las categorias
  */
  getCategories() {

    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);

  }

  /**
   * Metodo para guardar las categorias
   * Definir una interfaz para no utilizar any
   */
  saveCategory(body: any) {
    const endpoint = `${base_url}/categories`;
    //Enviamos hacia el back el body, para que lo guarde en la bd
    return this.http.post(endpoint, body);
  }

  /**
   * Metodo para actualizar una categoria
   */
  updateCategory(body: any, id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    //En este caso utilizamos el metodo put para actualizar la categoria
    return this.http.put(endpoint, body);
  }

  /**
   * Metodo para eliminar categorias
   */
  deleteCategory(id: any) {
    const endpoint = `${base_url}/categories/${id}`;
    //En este caso utilizamos el metodo delete para eliminar la categoria
    return this.http.delete(endpoint);
  }




}
