import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './components/form.component';
import { WelcomeComponent } from './components/welcome.component';
import { ConfirmComponent } from './components/confirm.component';
import { ListComponent } from './components/list.component';

const ROUTES: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'transact', component: FormComponent },
  { path: 'transact/:id', component: FormComponent },
  { path: 'confirm/:id', component: ConfirmComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
