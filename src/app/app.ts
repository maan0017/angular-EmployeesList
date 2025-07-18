import {
  Component,
  HostListener,
  Inject,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EmployeeModelInterface } from '../models/Employee';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AddEmployee } from './components/add-employee/add-employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, CommonModule, AddEmployee],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'EmployeeManager';
  // private platformId = inject(PLATFORM_ID);
  showAddEmplyeeDialoge: boolean = false;
  selectedEmployee: EmployeeModelInterface = {
    id: '',
    name: '',
    city: '',
    state: '',
    email: '',
    phone: '',
    address: '',
  };

  listOfData: EmployeeModelInterface[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmployees = localStorage.getItem('employees');

      try {
        const employees = storedEmployees ? JSON.parse(storedEmployees) : [];
        this.listOfData = Array.isArray(employees) ? employees : [];
      } catch (e) {
        console.error('Error parsing localStorage employees:', e);
        this.listOfData = [];
      }
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  toggleAddEmployeeDialoge() {
    this.showAddEmplyeeDialoge = !this.showAddEmplyeeDialoge;
    if (!this.showAddEmplyeeDialoge && this.selectedEmployee.id) {
      this.selectedEmployee = {
        id: '',
        name: '',
        city: '',
        state: '',
        email: '',
        phone: '',
        address: '',
      };
    }
  }

  deleteEmployee(id: string) {
    this.listOfData = this.listOfData.filter((ele) => ele.id !== id);
    localStorage.setItem('employees', JSON.stringify(this.listOfData));
  }

  handleEmployee(employee: EmployeeModelInterface) {
    console.log('add employe ->');
    console.log(employee);
    let index = this.listOfData.findIndex((emp) => emp.id === employee.id);
    console.log('index', index);

    if (index === -1) {
      // If not found, add new employee
      this.listOfData = [...this.listOfData, employee];
    } else {
      // If found, replace the existing item immutably
      this.listOfData = [
        ...this.listOfData.slice(0, index),
        employee,
        ...this.listOfData.slice(index + 1),
      ];
    }
    localStorage.setItem('employees', JSON.stringify(this.listOfData));
  }

  editEmployee(employee: EmployeeModelInterface) {
    this.selectedEmployee = employee;
    this.toggleAddEmployeeDialoge();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.toLocaleLowerCase() === 'n') {
      this.toggleAddEmployeeDialoge();
    }
  }
}
