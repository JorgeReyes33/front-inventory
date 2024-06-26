import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../../shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  //Variables globales
  isAdmin: any;

  /**
   * Inyectar el servicio de categorias en este componente
   * para hacer disponibles sus metodos, en este caso nos interesa
   * getCategories(), esta es una forma nueva de realizar el inject de los servicios
   * Ya no es necesario hacerlo desde el constructor
   */
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private util = inject(UtilService);

  /**
   * Al iniciarse el ciclo de vida de este componente,
   * se manda llamar el metodo getCategories
   */
  ngOnInit(): void {
    this.getCategories();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  /**
   * Columnas para settear en la tabla
   */
  displayColumns: string[] = ['id', 'name', 'description', 'actions']
  dataSource = new MatTableDataSource<CategoryElement>();

  //Actualizar el paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
      this.dataSource.paginator = this.paginator;
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
        this.getCategories();
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
        this.getCategories();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al actualizar categoria", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data:{
        id: id,
        module: "category"
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Categoria Eliminada", "Exito");
        this.getCategories();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al eliminar categoria", "Error");
      }
    });
  }

  buscar(termino: string) {
    if(termino.length ===0) {
      return this.getCategories();
    }

    this.categoryService.getCategoriesById(termino)
      .subscribe( (resp:any) => {
          this.processCategoriesResponse(resp);
      })
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{

    return this.snackBar.open(message, action, {
      duration: 4000
    });

  }

  exportExcel() {

    this.categoryService.exportCategories()
      .subscribe((data:any) => {
        let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.download = "categorias.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("Archivo exportado correctamente", "Exito");
      }, (error: any) => {
        this.openSnackBar("Se produjo un error al exportar el archivo", "Error");
      })

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
