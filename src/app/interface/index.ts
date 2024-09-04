export interface Status{
    name: string,
    code: string
}

export interface Price{
    name: string,
    minPrice: number | null,
    maxPrice: number | null
}

export interface Customer {
    id: number,
    name: string,
    phone: string,
    address: string,
    status: string,
    employee: Employee
}

export interface Employee {
    id: number,
    employeeID: string,
    name: string,
    phone: string,
    address: string
}

export interface Order {
    id: number,
    employeeID: string,
    employeeName: string,
    customerName: string,
    createdAt: Date,
    price: number,
    status: string
}