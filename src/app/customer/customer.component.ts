import { Component } from '@angular/core';
import { Customer, Status } from '../interface';
import { ConfirmationService } from 'primeng/api';
import { CustomerService } from '../services/customer.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  statusOptions?: Status[];
  loading: boolean = false;
  customer?: Customer;
  customers: Customer[] = [];
  textSearch!: FormGroup;
  displayAddModal: boolean = false;
  displayUpdateModal: boolean = false;
  currentPage = 0;
  totalPage = 0;
  limit = 5;
  first = 0;
  
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private service: CustomerService
  ){}

  ngOnInit(){
    this.statusOptions = [
      { name: 'Đã phân', code: 'Đã phân'},
      { name: 'Chưa phân', code: 'Chưa phân'},
      { name: 'Không', code: ''},
    ]
    this.textSearch = this.fb.group({
      name: [''],
      phone: [''],
      address: [''],
      status: [null],
      employee: this.fb.group({
        name: ['']
      })
    });
    this.search()
  }

  onPageChange(data: any) {
    this.currentPage = data.page
    this.search()
  }

  search(){
    this.loading = true
    const textSearch = { ...this.textSearch.value };
    if (textSearch.status === null) {
      textSearch.status = ''
    };
    if (textSearch.employee.name === '') {
      textSearch.employee = null;
    };    
    this.service.searchData(textSearch, this.currentPage, this.limit).subscribe({
      next:(data) => {
        this.totalPage = data.totalRecords;
        this.customers = data.result;
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
      name: [''],
      phone: [''],
      address: [''],
      status: [null],
      employee: this.fb.group({
        name: ['']
      })
    });
    this.search()
  }

  get() {    
    this.loading = true
    this.service.getData().subscribe({
      next:(data) => {
        this.totalPage = data.result.length;
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

  showAddCustomerModal() {
    this.displayAddModal = true;
  }

  closeAddCustomerModal(data: boolean) {
    this.displayAddModal = false
    if(data){
      this.currentPage = 0
      this.clear()
      this.search()
      this.first = 1;
    }
  }

  showUpdateCustomerModal(data: Customer) {
    this.displayUpdateModal = true;
    this.customer = data;    
  }

  closeUpdateCustomerModal(data: boolean) {
    this.displayUpdateModal = false
    if(data){
      this.search()
    }
  }

  confirmDelete(customer: Customer) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteData(customer.id).subscribe({
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
