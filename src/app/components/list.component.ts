import { Component, OnInit } from '@angular/core';
import { TransactService } from '../services/transact.service';
import { Transaction } from '../models/transact';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  transactList: any;
  records: any;

  constructor(private transSvc: TransactService, private router: Router,
              private transactSvc: TransactService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
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
      this.transactList.sort((a, b) => a.name.localeCompare(b.name));
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
