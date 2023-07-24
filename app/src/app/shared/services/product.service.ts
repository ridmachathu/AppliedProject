import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    // Angular Modules 
    private http: HttpClient
  ) { }
  public GetAllProducts() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products");
  }

  public GetProductsDeals() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/deals");
  }

  public SearchProducts(query) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/search?query=" + query);
  }

  public GetProductsByCategory(category){
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/category/" + category);
  }

  public GetProductById(id) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/" + id);
  }

  public GetProductClasses() {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/classes");
  }

  public GetProductTypesForClass(productClass) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/types/" + productClass);
  }

  public GetProductCategoriesForType(productCategory) {
    return this.http.get("https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products/categories/" + productCategory);
  }

  // public post(url: string, data: any, options?: any) {
  //   return this.http.post(url, data, options);
  // }
  // public put(url: string, data: any, options?: any) {
  //   return this.http.put(url, data, options);
  // }
  // public delete(url: string, options?: any) {
  //   return this.http.delete(url, options);
  // }
}
