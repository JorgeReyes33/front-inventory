import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { ProductElement } from '../../../product/product/product.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  chartBar: any;
  chartDoughnut: any;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }

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

    const nameProduct: String [] = [];
    const account: number [] = [];

    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code === "200") {
      let listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

      const colors = [
        'rgba(252, 99, 99, 0.8)', // Rojo
        'rgba(52, 152, 219, 0.8)', // Azul
        'rgba(39, 174, 96, 0.8)', // Verde
        'rgba(241, 196, 15, 0.8)', // Amarillo
        'rgba(142, 68, 173, 0.8)', // Morado
        'rgba(58, 252, 236, 0.8)', //Aqua
        'rgba(237, 85, 245, 0.8)', //Rosa
        'rgba(108, 85, 245, 0.8)', //Lila
      ];

      //Grafico de barras...
      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            {
              label: 'Productos',
              data: account,
              //backgroundColor: colors
            }
          ]
        }
      });

      //Grafico de doughnut...
      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [
            {
              label: 'Productos',
              data: account,
              backgroundColor: colors
            }
          ]
        }
      });

    }
  }

}
