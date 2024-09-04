import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Employee, Status } from '../../../interface';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-orderAdd',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class OrderAddComponent {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  statusOptions?: Status[];
  orderForm!: FormGroup;
  customers: Customer[] = [];
  employees: Employee[] = [];
  loading = false;
  
  constructor(private fb: FormBuilder, private customerService: CustomerService, private employeeService: EmployeeService, private orderService: OrderService) { }

  ngOnChanges(): void {
    this.statusOptions = [
      { name: 'Đã thanh toán', code: 'Đã thanh toán'},
      { name: 'Đã chốt', code: 'Đã chốt'},
    ]
    
    this.orderForm = this.fb.group({
      employee: [null, Validators.required],
      customer: [null, Validators.required],
      price: [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],
      status: [null, Validators.required],
    });

    this.get()
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
    this.loading = true
    this.employeeService.getData().subscribe({
      next:(data) => {
        this.employees = data.result;
      },
      error:(e) =>{
        alert(e);
      },
      complete:() => {
        this.loading = false
      },
    });
    this.customerService.getData().subscribe({
      next:(data) => {
        this.customers = data.result;
      },
      error:(e) =>{
        alert(e);
      },
      complete:() => {
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const newOrder = this.orderForm.value;
      this.orderService.addData(newOrder).subscribe({
        next: () => {
          this.displayModalChange.emit(true)
          this.orderForm.reset();
        },
        error(e) {
          alert(e);
        }
      })
    }
  }

  onCancel(): void {
    this.displayModal = false;
    this.displayModalChange.emit(false)
    this.orderForm.reset();
  }
}
