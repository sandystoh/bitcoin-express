import { Component, OnInit } from '@angular/core';
import { TransactService } from '../services/transact.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Transaction } from '../models/transact';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  tr: any;
  id: any;
  sub: any;
  edit = 'Confirmed';

  constructor(private transSvc: TransactService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params.id;
      console.log(this.id);

      this.transSvc.getTransaction(this.id).subscribe(r => {
        console.log(r);
        this.tr = r;
      });
   });

    this.route.queryParams.subscribe(params => {
     const isEdit = params.edit;
     if (isEdit === 'true') {
       this.edit = 'Edited';
     }
   });
}

}
