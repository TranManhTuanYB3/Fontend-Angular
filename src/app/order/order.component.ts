import { Component } from '@angular/core';
import { Order, Status, Price } from '../interface';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  statusOptions?: Status[];
  priceOptions: Price[] = [];
  loading: boolean = false;
  order?: Order;
  orders: Order[] = [];
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
    private service: OrderService
  ) {}

  ngOnInit() {
    this.statusOptions = [
      { name: 'Đã thanh toán', code: 'Đã thanh toán' },
      { name: 'Đã chốt', code: 'Đã chốt' },
      { name: 'Đã hủy', code: 'Đã hủy' },
      { name: 'Không', code: '' },
    ];
    this.priceOptions = [
      { name: 'Nhỏ hơn 500.000', minPrice: null, maxPrice: 500000 },
      { name: '500.000 - 1.000.000', minPrice: 500000, maxPrice: 1000000 },
      { name: '1.000.000 - 1.500.000', minPrice: 1000000, maxPrice: 1500000 },
      { name: '1.500.000 - 2.000.000', minPrice: 1500000, maxPrice: 2000000 },
      { name: 'Lớn hơn 2.000.000', minPrice: 2000000, maxPrice: null },
      { name: 'Không', minPrice: null, maxPrice: null },
    ];
    this.textSearch = this.fb.group({
      employeeID: [''],
      employeeName: [''],
      customerName: [''],
      fromDate: [null],
      toDate: [null],
      price: [null],
      minPrice: [null],
      maxPrice: [null],
      status: [null],
    });
    this.search();
  }

  onPageChange(data: any) {
    this.currentPage = data.page;
    this.search();
  }

  search() {
    this.loading = true;
    const textSearch = { ...this.textSearch.value };
    textSearch.status === null ? (textSearch.status = '') : textSearch.status;
    textSearch.fromDate === null
      ? null
      : (textSearch.fromDate = format(textSearch.fromDate, 'dd-MM-yyyy'));
    textSearch.toDate === null
      ? null
      : (textSearch.toDate = format(textSearch.toDate, 'dd-MM-yyyy'));
    if (textSearch.price != null) {
      if (textSearch.price.minPrice != null) {
        textSearch.minPrice = textSearch.price.minPrice;
      }
      if (textSearch.price.maxPrice != null) {
        textSearch.maxPrice = textSearch.price.maxPrice;
      }
    }

    this.service
      .searchData(textSearch, this.currentPage, this.limit)
      .subscribe({
        next: (data) => {
          this.totalPage = data.totalRecords;
          this.orders = data.result;
        },
        error: (e) => {
          alert(e);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  clear() {
    this.textSearch = this.fb.group({
      employeeID: [''],
      employeeName: [''],
      customerName: [''],
      fromDate: [null],
      toDate: [null],
      price: [null],
      minPrice: [null],
      maxPrice: [null],
      status: [null],
    });
    this.search()
  }

  get() {
    this.loading = true;
    this.service.getData().subscribe({
      next: (data) => {
        this.totalPage = data.result.length;
        this.orders = data.result;
      },
      error: (e) => {
        alert(e);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showAddOrderModal() {
    this.displayAddModal = true;
  }

  closeAddOrderModal(data: boolean) {
    this.displayAddModal = false;
    if (data) {
      this.currentPage = 0;
      this.clear()
      this.search();
      this.first = 1;
    }
  }

  showUpdateOrderModal(data: Order) {
    this.displayUpdateModal = true;
    this.order = data;
  }

  closeUpdateOrderModal(data: boolean) {
    this.displayUpdateModal = false;
    if (data) {
      this.search();
    }
  }

  confirmDelete(order: Order) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteData(order.id).subscribe({
          next: () => {
            this.search();
          },
          error(e) {
            alert(e);
          },
        });
      },
    });
  }
}
