import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Employee } from '../../../interface';
import { EmployeeService } from '../../../services/employee.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customerAdd',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class CustomerAddComponent {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  customerForm!: FormGroup;
  employees: Employee[] = [];
  loading = false;
  
  constructor(private fb: FormBuilder, private customerService: CustomerService, private employeeService: EmployeeService) { }
  
  ngOnChanges(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      status: ['Chưa phân', Validators.required],
      employee: [null]
    });

    this.get()

    this.customerForm.get('employee')?.valueChanges.subscribe(employee => {
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
    this.loading = true
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
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const newCustomer = this.customerForm.value;
      this.customerService.addData(newCustomer).subscribe({
        next: () => {
          this.displayModalChange.emit(true)
          this.customerForm.reset();
        },
        error(e) {                  
          alert(e.error.result.Phone);
        }
      })
    }
  }

  onCancel(): void {
    this.displayModal = false;
    this.displayModalChange.emit(false)
    this.customerForm.reset();
  }
}
