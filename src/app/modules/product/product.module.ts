import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';



@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    //Importar el componente de angular material
    MaterialModule,
    //imports para trabajar con formularios
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
