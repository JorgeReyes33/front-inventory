import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { UtilService } from '../../shared/services/util.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  //Variables globales
  isAdmin: any;

  //Injectar el servicio
  private productService = inject(ProductService)
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog)
  private util = inject(UtilService);

  ngOnInit(): void {

    //Se manda llamar aqui el metodo para que al iniciar
    //el componente se mande llamar
    this.getProducts();
    this.isAdmin = this.util.isAdmin();

  }

  //Aqui se configuran las columnas que tendra la tabla
  displayColumns: string[] = ['id', 'name', 'price', 'account', 'category', 'picture', 'actions']
  dataSource = new MatTableDataSource<ProductElement>();

  //Actualizar el paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts() {
    this.productService.getProducts()
      .subscribe( (data: any) => {
        console.log("respuesta de productos: ", data)
        this.processProductResponse(data);
      }, (error:any) => {
        console.log("respuesta de productos: ", error)
      })
  }

  processProductResponse(resp: any) {
    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code === "200") {
      let listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,'+element.picture;
        dateProduct.push(element);
      });

      //Set el datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto Guardada", "Exito");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al guardar producto", "Error");
      }
    });
  }

  //Colocar esto en un servicio para evitar codigo extra
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{

    return this.snackBar.open(message, action, {
      duration: 4000
    });

  }

  edit(id: number, name:string, price:number, account:number, category:any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: {id: id, name: name, price: price, account: account, category: category}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto Editado", "Exito");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar producto", "Error");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {id: id, module: "product"}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Producto Eliminado", "Exito");
        this.getProducts();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al eliminar producto", "Error");
      }
    });
  }

  buscar(name: any) {
    if(name.length === 0) {
      return this.getProducts();
    }

    this.productService.getProductByName(name)
      .subscribe((resp:any) => {
        this.processProductResponse(resp);
      })
  }

  exportProductExcel() {

    this.productService.exportProducts()
      .subscribe((data:any) => {
        let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.download = "productos.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("Archivo exportado correctamente", "Exito");
      }, (error: any) => {
        this.openSnackBar("Se produjo un error al exportar el archivo", "Error");
      })

  }

}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  account: number;
  category: any;
  picture: any;
}
