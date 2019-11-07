import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropdownDemoComponent } from './dropdown-demo/dropdown-demo.component';

const routes: Routes = [
  {
    path: 'demo',
    component: DropdownDemoComponent,
    data: { title: 'Demo dropdown-select' }
  },
  {
    path: '',
    redirectTo: '/demo',
    pathMatch: 'full'
  },
  { path: '**', component: DropdownDemoComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
