import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number,
  quantity: number,
  country: string,
  active: boolean,
  rate: number,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'https://my-json-server.typicode.com/nelsoncastro/primeng-angular/products';

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.url)
      .pipe(retry(2), catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + '/' + id)
      .pipe(retry(1), catchError(this.handleError))
  }

  getProductByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + '?name_like=' + name)
      .pipe(retry(1), catchError(this.handleError));
  }

  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, JSON.stringify(product), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.url + '/' + product.id,
      JSON.stringify(product), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  delete(product: Product) {
    return this.http.delete<Product>(this.url + '/' + product.id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }


  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
