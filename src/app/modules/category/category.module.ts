import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './components/category/category.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    //Importar el componente de angular material
    MaterialModule,
    //imports para trabajar con formularios
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryComponent
  ]
})
export class CategoryModule { }
