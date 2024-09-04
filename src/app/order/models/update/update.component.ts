import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, Customer, Employee, Status } from '../../../interface';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-orderUpdate',
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class OrderUpdateComponent {
  @Input() displayModal: boolean = false;
  @Input() order?: Order;
  @Output() displayModalChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  statusOptions?: Status[];
  orderForm!: FormGroup;
  customers: Customer[] = [];
  employees: Employee[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private orderService: OrderService
  ) {}

  ngOnChanges(): void {
    this.orderForm = this.fb.group({
      id: [this.order?.id],
      employee: [{ value: this.order?.employeeName, disabled: true }],
      customer: [{ value: this.order?.customerName, disabled: true }],
      price: [{ value: this.order?.price, disabled: true }],
      status: [this.order?.status, Validators.required],
    });
  
    this.statusOptions = [
      { name: 'Đã thanh toán', code: 'Đã thanh toán' },
      { name: 'Đã chốt', code: 'Đã chốt' },
      { name: 'Đã hủy', code: 'Đã hủy' },
    ];
    
    this.get();
  }

  getErrorMessage(field: string) {
    const control = this.orderForm.get(field);
    if (control?.hasError('required')) {
      return `${field} is required`;
    } else if (control?.hasError('minlength')) {
      return `${field} must be at least ${control.getError('minlength').requiredLength} characters long`;
    } else if (control?.hasError('maxlength')) {
      return `${field} cannot exceed ${control.getError('maxlength').requiredLength} characters`;
    } else if (control?.hasError('pattern')) {
      return `Invalid ${field} format`;
    }
    return '';
  }

  get() {
    this.loading = true;
    this.employeeService.getData().subscribe({
      next: (data) => {
        this.employees = data.result;
      },
      error: (e) => {
        alert(e);
      },
      complete: () => {
        this.loading = false;
      },
    });
    this.customerService.getData().subscribe({
      next: (data) => {
        this.customers = data.result;
      },
      error: (e) => {
        alert(e);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const newOrder = this.orderForm.value;
      this.orderService.updateData(newOrder).subscribe({
        next: () => {
          this.displayModalChange.emit(true);
          this.orderForm.reset();
        },
        error(e) {
          alert(e);
        },
      });
    }
  }
  onCancel(): void {
    this.displayModal = false;
    this.displayModalChange.emit(false);
    this.orderForm.reset();
  }
}
