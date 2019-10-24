import { Injectable } from '@angular/core';
import { Transaction } from '../models/transact';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.API_URL + 'transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactService {

  constructor(private http: HttpClient) { }

  getAllTransactions() {
    return this.http.get(API_URL + '/get');
  }

  getTransaction(id) {
    console.log(API_URL + '/get/', id);
    return this.http.get(API_URL + '/get/' + id);
  }

  saveTransaction(tran: Transaction) {
    return this.http.post(API_URL + '/create', tran);
  }

  updateTransaction(id, tran) {
    return this.http.put(API_URL + '/update/' + id, tran);
  }

  deleteTransaction(id) {
    return this.http.delete(API_URL + '/delete/' + id);
  }
}
