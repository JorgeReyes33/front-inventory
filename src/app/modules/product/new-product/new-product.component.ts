import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';

export interface Category{
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {
  /**
   * FormGroup es una forma de trabajar con los formulario en angular
   */
  public productForm!: FormGroup;
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  private productService = inject(ProductService);
  public data = inject(MAT_DIALOG_DATA);

  //variable para manejar estado de los formularios
  estadoForm: string = "";
  //Arreglo de categorias
  categories: Category[] = [];
  selectedFile: any;
  nameImage: string = "";

  ngOnInit(): void {

    console.log(this.data);

    this.estadoForm = "Agregar";
    /**
     * Inicializar el formulario y hacer ciertas validaciones
     * En este caso indicar que el campo es requerido
     */
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required]
    });

    this.getCategories();

    if(this.data != null) {
      this.updateForm(this.data);
      this.estadoForm =  "Actualizar";
    }

  }

  onFileChanged(event: any) {

    //Acceder al archivo, en este caso la foto a subir
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImage = event.target.files[0].name;

  }

  //Metodo para guardar el producto
  onSave() {

    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('account', data.account);
    uploadImageData.append('categoryId', data.category);

    if(this.data != null) {

      //Actualizar un producto
      this.productService.updateProduct(uploadImageData, this.data.id)
        .subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        })

    } else {

      //Llamamos al servicio para guardar el producto
      this.productService.saveProduct(uploadImageData)
      .subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      })

    }

  }

  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe((data:any) => {
        this.categories = data.categoryResponse.category;
      }, (error:any) => {
        console.log("error al consultar categorias", error);
      })
  }

  updateForm(data: any) {

    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      account: [data.account, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ['', Validators.required]
    });

  }

}
