import { Injectable } from '@angular/core';
import { Transaction } from '../models/transact';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactService {
  API_URL = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) { }

  getAllTransactions() {
    return this.http.get(this.API_URL + '/get');
  }

  getTransaction(id) {
    console.log(this.API_URL + '/get/', id);
    return this.http.get(this.API_URL + '/get/' + id);
  }

  saveTransaction(tran: Transaction) {
    return this.http.post(this.API_URL + '/create', tran);
  }

  updateTransaction(id, tran) {
    return this.http.put(this.API_URL + '/update/' + id, tran);
  }
}
