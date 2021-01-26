import { Product, ProductService } from './../../product.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [MessageService],
})
export class AddProductComponent implements OnInit {

  // Headers
  id: number = 0;
  product: Product;
  validateForm!: FormGroup;
  items: MenuItem[];
  home: MenuItem;

  categories: any[] = [{name: 'A', key: 'A'},
                       {name: 'B', key: 'B'},
                       {name: 'C', key: 'C'},
                       {name: 'D', key: 'D'}];

  countrys: Country[] = [{ name: 'Argentina', code: 'AR' },
                        { name: 'Bolivia', code: 'BO' },
                        { name: 'Brazil', code: 'BR' },
                        { name: 'Chile', code: 'CL' },
                        { name: 'Ecuador', code: 'EC' },
                        { name: 'Paraguay', code: 'PY' },
                        { name: 'Peru', code: 'PE' },
                        { name: 'Venezuela', code: 'VE' },
                      ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private messageService: MessageService,
    private productService: ProductService,
    private ngZone: NgZone) {

      this.validateForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        category: ['A', [Validators.required]],
        country: ['BR', [Validators.required]],
        quantity: [0, [Validators.required]],
        price: [0.0, [Validators.required]],
        active: [false, [Validators.required]],
        rate: [0, [Validators.required]],
      });
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.loadProduct(this.id);

    this.items = [
      { label: 'Produto' },
      { label: this.product ? 'Editar' : 'Novo' },
    ];
    this.home = { icon: 'pi pi-home' }
  }

  loadProduct(id: number) {
    if (this.id) {
      this.productService.getProductById(id)
        .subscribe(product => {
          this.product = product;
          this.validateForm.patchValue(product);
        });
    }
  }

  submitForm(value: { id: number; name: string; description: string; price: number; quantity: number }): void {
    if (this.id !== undefined) {
      value.id = this.id;
      this.productService.updateProduct((value as Product)).subscribe(() => {
        this.showSuccessMsg('Registro atualizado com sucesso!!!');
      });
    } else {
      this.productService.saveProduct((value as Product)).subscribe(() => {
        this.showSuccessMsg('Registro criado com sucesso!!!');
      });
    }
    setTimeout(() => {
      this.router.navigate([""]);
    }, 1000);
  }

  resetForm(): void {
    this.validateForm.reset();
    this.router.navigate([""]);
  }

  createNotification(severity: string, summary: string, detail: string): void {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  showSuccessMsg(message: string): void {
    this.createNotification('success', 'Sucesso', message);
  }

  showErrorMsg(message: string): void {
    this.createNotification('error', 'Erro', message);
  }

  showWarningMsg(message: string): void {
    this.createNotification('warn', 'Atenção', message);
  }

  showInfoMsg(message: string): void {
    this.createNotification('info', 'Informação', message);
  }
}
