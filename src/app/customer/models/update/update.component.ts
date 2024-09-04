import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Employee } from '../../../interface';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customerUpdate',
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class CustomerUpdateComponent {
  @Input() displayModal: boolean = false;
  @Input() customer?: Customer;
  @Output() displayModalChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  customerForm!: FormGroup;
  employees: Employee[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private employeeService: EmployeeService
  ) {}

  ngOnChanges(): void {
    this.customerForm = this.fb.group({
      id: [this.customer?.id],
      name: [this.customer?.name, Validators.required],
      phone: [this.customer?.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [this.customer?.address],
      status: [this.customer?.status, Validators.required],
      employee: [this.customer?.employee],
    });

    this.get()

    this.customerForm.get('employee')?.valueChanges.subscribe((employee) => {
      if (employee) {
        this.customerForm.get('status')?.setValue('Đã phân');
      } else {
        this.customerForm.get('status')?.setValue('Chưa phân');
      }
    });
  }

  getErrorMessage(field: string) {
    const control = this.customerForm.get(field);
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
    if (this.customer?.employee) {
      this.employeeService
        .getId(this.customer?.employee.id)
        .subscribe({
          next:(data) => {
            this.employees = data.result;
            this.loading = false;
          },
          error:(e) =>{
            alert(e);
            this.loading = false;
          },
          complete:() => {
            this.loading = false;
          },
        });
    } else {
      this.employeeService.getNoId().subscribe({
      next:(data) => {
        this.employees = data.result;
        this.loading = false;
      },
      error:(e) =>{
        alert(e);
        this.loading = false;
      },
      complete:() => {
        this.loading = false;
      },
    })
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const newCustomer = this.customerForm.value;
      this.customerService.updateData(newCustomer).subscribe({
        next: () => {
          this.displayModalChange.emit(true);
        },
        error(e) {
          alert(e.error.result.Phone);
        }
      });
    }
  }
  onCancel(): void {
    this.displayModal = false;
    this.displayModalChange.emit(false);
    this.customerForm.reset();
  }
}
