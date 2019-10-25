import { Component, OnInit } from '@angular/core';
import { TransactService } from '../services/transact.service';
import { Transaction } from '../models/transact';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  transactList: any;
  records: any;
  isLoading = true;

  constructor(private transSvc: TransactService, private router: Router,
              private transactSvc: TransactService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isLoading = true;
    this.getList();
  }

  getList() {
    this.transSvc.getAllTransactions().subscribe(r => {
      this.transactList = Object.keys(r).map(item => {
        return {
          id: item,
          ...r[item]
        } as Transaction;
      });
      this.transactList.sort((a, b) => b.orderDate - a.orderDate);
      this.isLoading = false;
    });
  }

  toEdit(id) {
    this.router.navigate(['/transact', id]);
  }

  toDelete(name, id) {
    this.transactSvc.deleteTransaction(id).subscribe(() => {
        this.snackBar.open('Transaction by ' + name + ' Deleted', 'OK', {
          duration: 2000,
        });
        this.getList();
    });
  }
}
