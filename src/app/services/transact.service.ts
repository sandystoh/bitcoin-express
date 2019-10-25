import { Injectable } from '@angular/core';
import { Transaction } from '../models/transact';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.API_URL + 'transactions/';

@Injectable({
  providedIn: 'root'
})
export class TransactService {

  constructor(private http: HttpClient) { }

  getAllTransactions() {
    return this.http.get(API_URL).toPromise();
  }

  getTransaction(id) {
    console.log(API_URL, id);
    return this.http.get(API_URL + id).toPromise();
  }

  saveTransaction(tran: Transaction) {
    return this.http.post(API_URL, tran).toPromise();
  }

  updateTransaction(id, tran) {
    return this.http.put(API_URL + id, tran).toPromise();
  }

  deleteTransaction(id) {
    return this.http.delete(API_URL + id).toPromise();
  }
}
