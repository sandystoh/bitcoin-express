import { Component, OnInit } from '@angular/core';
import { TransactService } from '../services/transact.service';
import { Transaction } from '../models/transact';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  transactList: any;
  records: any;

  constructor(private transSvc: TransactService, private router: Router) { }

  ngOnInit() {
    this.transSvc.getAllTransactions().subscribe(r => {
      this.transactList = Object.keys(r).map(item => {
        return {
          id: item,
          ...r[item]
        } as Transaction;
      });
    });
  }

  toEdit(id) {
    console.log(id);
    this.router.navigate(['/transact', id]);
  }

}
