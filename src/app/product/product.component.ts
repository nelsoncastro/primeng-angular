import { Product } from './../product.service';
import { ProductService } from '../product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService],
})
export class ProductComponent implements OnInit {

  validateForm!: FormGroup;
  products: Product[];
  items: MenuItem[];
  home: MenuItem;
  first = 0;
  rows = 10;

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService) {

    this.validateForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.items = [
      { label: 'Produto' },
      { label: 'Consultar' },
    ];
    this.home = { icon: 'pi pi-home' }

    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  addClick() {
    this.router.navigate(["add"]);
  }

  confirm(product: Product) {
    this.confirmationService.confirm({
      target: event.target,
      message: "Deseja realmente excluir o registro?",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Você excluiu o registro com sucesso!"
        });
        this.productService.delete(product).subscribe(() => {
          this.loadData();
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "error",
          summary: "Cancelado",
          detail: "Você cancelou a operação"
        });
      }
    });

    this.loadData();
  }

  submitForm(value: { name: string; }): void {
    this.productService.getProductByName(value.name).
      subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  resetForm(): void {
    this.validateForm.reset();
    this.loadData();
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.products ? this.first === (this.products.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.products ? this.first === 0 : true;
  }

}
