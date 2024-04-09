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

}
