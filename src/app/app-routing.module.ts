import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { OrderComponent } from './order/order.component';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/layout/customer', pathMatch: 'full' },
  { 
    path: 'layout', 
    component: LayoutComponent,
    children: [
      { path: 'customer', component: CustomerComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'order', component: OrderComponent }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
