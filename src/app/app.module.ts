import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormComponent } from './components/form.component';
import { ConfirmComponent } from './components/confirm.component';
import { WelcomeComponent } from './components/welcome.component';

import { BitcoinService } from './services/bitcoin.service';
import { TransactService } from './services/transact.service';
import { ListComponent } from './components/list.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ConfirmComponent,
    WelcomeComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [BitcoinService, TransactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
