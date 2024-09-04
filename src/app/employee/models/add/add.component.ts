import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employeeAdd',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class EmployeeAddComponent {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  employeeForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private employeeService: EmployeeService) { }

  ngOnChanges(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
    });
  }

  getErrorMessage(field: string) {
    const control = this.employeeForm.get(field);
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

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.value;
      this.employeeService.addData(newEmployee).subscribe({
        next: () => {
          this.displayModalChange.emit(true)
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
    this.employeeForm.reset();
  }
}
