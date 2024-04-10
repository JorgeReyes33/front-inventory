import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  /**
   * Inyectar el servicio de categorias en este componente
   * para hacer disponibles sus metodos, en este caso nos interesa
   * getCategories(), esta es una forma nueva de realizar el inject de los servicios
   * Ya no es necesario hacerlo desde el constructor
   */
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  /**
   * Al iniciarse el ciclo de vida de este componente,
   * se manda llamar el metodo getCategories
   */
  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Columnas para settear en la tabla
   */
  displayColumns: string[] = ['id', 'name', 'description', 'actions']
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories(): void {
    /**
     * Con el subscribe el componente se da cuenta cuando llega la informacion del
     * endpoint y se podra procesar la informacion
     */
    this.categoryService.getCategories()
      .subscribe( (data:any) => {

          console.log("Respuesta de categories: ", data);
          this.processCategoriesResponse(data);

      }, (error: any) => {
        console.log("Error: ", error);
      } )
  }

  processCategoriesResponse(resp: any) {

    //Definimos una constante que guardara los datos en un arreglo de tipo CategoryElement
    const dataCategory: CategoryElement[] = [];

    //Validamos que se tenga una respuesta exitosa
    if (resp.metadata[0].code == "00") {
      let listCategory = resp.categoryResponse.category;

      //iteramoa aobre la lista de categorias y la guardamos en el arreglo que declaramos
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      })

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory)
    }

  }

  /**
   * Metodo para desplegar un modal
   */
  // openCategoryDialog() {
  //   const dialogRef = this.dialog.open( NewCategoryComponent, {
  //     width: '450px',
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {

  //     if( result == 1) {
  //       this.openSnackBar("Categoria Guardada", "Exito");
  //       this.getCategories();
  //     }else if( result == 2) {
  //       this.openSnackBar("Se produjo un error al guardar", "Error");
  //     }

  //   });
  // }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Categoria Guardada", "Exito");
        this.getCategories(); // Mover la llamada aquí dentro del bloque if
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al guardar", "Error");
      }
    });
  }

  edit(id:number, name:string, description:string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data:{
        id: id,
        name: name,
        description: description
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Categoria Actualizada", "Exito");
        this.getCategories(); // Mover la llamada aquí dentro del bloque if
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al actualizar categoria", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{

    return this.snackBar.open(message, action, {
      duration: 4000
    });

  }



}

/**
 * Definicion de interfaces
 */

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
