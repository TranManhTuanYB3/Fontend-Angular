import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { OrderComponent } from './order/order.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomerAddComponent } from './customer/models/add/add.component';
import { CustomerUpdateComponent } from './customer/models/update/update.component';
import { EmployeeAddComponent } from './employee/models/add/add.component';
import { EmployeeUpdateComponent } from './employee/models/update/update.component';
import { DialogModule } from 'primeng/dialog';
import { SpinnerModule } from 'primeng/spinner';
import { LayoutComponent } from './layout/layout/layout.component';
import { OrderAddComponent } from './order/models/add/add.component';
import { OrderUpdateComponent } from './order/models/update/update.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    EmployeeComponent,
    OrderComponent,
    LayoutComponent,
    CustomerAddComponent,
    CustomerUpdateComponent,
    EmployeeAddComponent,
    EmployeeUpdateComponent,
    OrderAddComponent,
    OrderUpdateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SidebarModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    DropdownModule,
    PaginatorModule,
    PanelModule,
    TableModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    SpinnerModule,
    CalendarModule
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
