import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Transaction, TransactResponse } from '../models/transact';
import * as moment from 'moment';
import { BitcoinService } from '../services/bitcoin.service';
import { TransactService } from '../services/transact.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  transactForm: FormGroup;
  model: Transaction = {
    name: '',
    contact: '',
    gender: '',
    dob: '',
    orderDate: '',
    orderType: '',
    unit: null,
    btcAddress: ''
  };
  startDate: any;
  bitcoin = {ask: 0, bid: 0};
  rate = 0;
  transactionAmount = 0;
  sub: any;
  id = '';
  tr: Transaction;
  request = '';

  constructor(private formBuilder: FormBuilder, private btcSvc: BitcoinService,
              private transSvc: TransactService, private router: Router,
              private route: ActivatedRoute, private cd: ChangeDetectorRef) {
    this.transactForm = this.createFormGroup();
    this.startDate = moment();

}

ngAfterViewInit() {
  this.cd.detectChanges();
}

  async getPrice(): Promise<any> {
    return await this.btcSvc.getPrice().then((result) => {
      console.log(result); this.bitcoin = result; })
      .catch(() => {
        console.log('API Error');
        this.bitcoin = {ask: 11500, bid: 11600};
      });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.transSvc.getTransaction(this.id).subscribe(r => {
          this.tr = r as Transaction;
          this.transactForm.patchValue(this.tr);
          this.request = 'Edit';
          this.getPrice().then(() => {
            this.rate = (this.tr.orderType === 'Buy') ? this.bitcoin.ask : this.bitcoin.bid;
            this.transactionAmount = this.tr.unit * this.rate;
          });
          this.transactForm.get('dob').setValue(moment(this.tr.dob));
          this.transactForm.get('orderDate').setValue(new Date());
          }, (e) => console.log(e), () => {
            this.changeType();
        });
      } else {
        this.getPrice().then(() => {
          this.rate = (this.transactForm.value.orderType === 'Buy') ? this.bitcoin.ask : this.bitcoin.bid;
        });
        this.transactForm.get('orderDate').setValue(new Date());
        this.transactForm.get('orderType').setValue('Buy');
        this.request = 'New';
      }

   });
  }

  get f() { return this.transactForm.controls; }

  createFormGroup() {
     return new FormGroup({
      name: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required, Validators.pattern('^[8-9][0-9]{7}$')]),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required, this.ageValidator(21)]),
      orderDate: new FormControl('', [Validators.required]),
      orderType: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      btcAddress: new FormControl('', [Validators.required]),
    });
  }

  ageValidator(min: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const age = moment().diff(control.value, 'years');
      return age < min ? {ageValidation: {value: control.value}} : null;
    };
  }

  calculatePrice($event) {
    this.rate = (this.transactForm.value.orderType === 'Buy') ? this.bitcoin.ask : this.bitcoin.bid;
    this.transactionAmount = $event.target.value * this.rate;
  }

  changeType() {
    if (this.transactForm.value.orderType === 'Sell') {
      this.transactForm.get('btcAddress').setValidators(null);
      this.transactForm.get('btcAddress').setErrors(null);
    } else {
      this.transactForm.get('btcAddress').setValidators([Validators.required]);
    }
  }

  cancel() {
    this.transactForm.reset();
    this.router.navigate(['/']);
  }

  onSubmit() {
    const val = this.transactForm.value;
    const save: Transaction = {
      name: val.name,
      contact: val.contact,
      gender: val.gender,
      dob: val.dob.valueOf(),
      orderDate: val.orderDate.valueOf(),
      orderType: val.orderType,
      unit: val.unit,
      btcAddress: (val.orderType === 'Buy') ? val.btcAddress : null,
      rate: this.rate,
      total: this.transactionAmount
    };

    console.log(save);
    if (this.request === 'Edit') {
      console.log('edit transaction:', this.id);
      this.transSvc.updateTransaction(this.id, save).subscribe(r => {
        console.log(r);
        const resp = r as TransactResponse;
        this.router.navigate(['/confirm', resp.transactionId], { queryParams: { edit: true}});
      });
    } else {
      console.log('New transaction');
      this.transSvc.saveTransaction(save).subscribe(r => {
        console.log(r);
        const resp = r as TransactResponse;
        this.router.navigate(['/confirm', resp.transactionId], { queryParams: { edit: false}});
      });
    }
  }
}
