import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit{

  /**
   * FormGroup es una forma de trabajar con los formulario en angular
   */
  public categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);

  ngOnInit(): void {
    /**
     * Inicializar el formulario y hacer ciertas validaciones
     * En este caso indicar que el campo es requerido
     */
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  onSave() {

    /**
     * Aqui extraemos lo que el usuario ingreso en el formulario
     */
    let data = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }

    this.categoryService.saveCategory(data)
      .subscribe( (data: any) => {
        console.log(data);
        this.dialogRef.close(1);
      }, (error:any) => {
        this.dialogRef.close(2);
      })

  }

  onCancel() {
    this.dialogRef.close(3);
  }

}
