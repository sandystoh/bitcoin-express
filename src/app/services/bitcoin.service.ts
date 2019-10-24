import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';

export const API_URL = 'http://localhost:3000/api/';
// API = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/all';
// ?crypto=BTC&fiat=SGD';

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  constructor(private http: HttpClient) { }

  getPrice() {
    return this.http.get<any>(API_URL + 'price')
    .pipe(
      map(res => {
        const r = JSON.parse(res);
        return {ask: r.BTCSGD.ask, bid: r.BTCSGD.bid};
      })
    ).toPromise();

  }
}
