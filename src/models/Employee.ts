export interface EmployeeModelInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export class EmployeeModel {
  id: string;
  email: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  address: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.city = '';
    this.state = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }
}
