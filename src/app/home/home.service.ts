import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  filterMappings:  {[key: string]: { queryParam: string }} =  {
    priceFrom: {
     queryParam: 'price_gte',
   },
   priceTo: {
     queryParam: 'price_lte',
   },
   ratingFrom: {
     queryParam: 'rating.rate_gte',
   },
   ratingTo: {
     queryParam: 'rating.rate_lte',
   },
   inStock: {
     queryParam: 'stock_gt',
   },
   hasReviews: {
     queryParam: 'rating.count_gt',
   }
 }

  constructor() { }

  getHttpParams(filterForm: FormGroup): HttpParams {
    let params = new HttpParams();

    Object.keys(filterForm.value).forEach(key => {
      if (filterForm.value[key]) {
      params = params.set(this.filterMappings[key].queryParam,
          (filterForm.value[key] === true ? 0 : filterForm.value[key])
      );
    }
    })
    return params;
  }
}
