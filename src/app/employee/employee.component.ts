import { Component } from '@angular/core';
import { Employee } from '../interface';
import { ConfirmationService } from 'primeng/api';
import { EmployeeService } from '../services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  loading: boolean = false;
  employee?: Employee;
  employees: Employee[] = [];
  textSearch!: FormGroup;
  displayAddModal: boolean = false;
  displayUpdateModal: boolean = false;
  currentPage = 0;
  totalPage = 0;
  limit = 5;
  first = 0;

  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private service: EmployeeService){}

  ngOnInit() {
    this.textSearch = this.fb.group({
      employeeID: [''],
      name: [''],
      phone: [''],
      address: [''],
    })
    this.search();
  }
  
  get() {
    this.loading = true;
    
    this.service.getData().subscribe({
      next:(data) => {
        this.totalPage = data.result.length;
        this.employees = data.result;
      },
      error:(e) =>{
        alert(e);
      },
      complete:() => {
        this.loading = false;
      },
    })
  }

  onPageChange(data: any) {
    this.currentPage = data.page
    this.search()
  }

  search(){
    this.loading = true

    const textSearch = { ...this.textSearch.value };
    this.service.searchData(textSearch, this.currentPage, this.limit).subscribe({
      next:(data) => {
        this.totalPage = data.totalRecords
        this.employees = data.result;
      },
      error:(e) =>{
        alert(e);
      },
      complete:() => {
        this.loading = false;
      },
    })
  }

  clear() {
    this.textSearch = this.fb.group({
      employeeID: [''],
      name: [''],
      phone: [''],
      address: [''],
    });
    this.search()
  }

  showAddEmployeeModal() {
    this.displayAddModal = true;
  }

  closeAddEmployeeModal(data: boolean) {
    this.displayAddModal = false
    if(data){
      this.currentPage = 0
      this.clear()
      this.search()
      this.first = 1;
    }
  }

  showUpdateEmployeeModal(data: Employee) {
    this.displayUpdateModal = true;
    this.employee = data;    
  }

  closeUpdateEmployeeModal(data: boolean) {
    this.displayUpdateModal = false
    if(data){
      this.search()
    }
  }

  confirmDelete(employee: Employee) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteData(employee.id).subscribe({
          next:()=>{
            this.search()
          },
          error(e){
            alert(e);
          }
        });
      }
    });
  }
}
