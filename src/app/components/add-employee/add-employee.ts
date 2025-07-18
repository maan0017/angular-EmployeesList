import {
  Component,
  EventEmitter,
  Output,
  inject,
  OnDestroy,
  OnInit,
  Input,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NumberOnlyDirective } from '../../../directives/NumbersOnly.Directive';
import { v4 as uuidv4 } from 'uuid';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EmployeeModelInterface } from '../../../models/Employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzTimePickerModule,
    NzButtonModule,
    NzCheckboxModule,
    NumberOnlyDirective,
  ],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class AddEmployee implements OnInit {
  @Input() employee!: EmployeeModelInterface; // receives the object from parent
  @Output() close_popup = new EventEmitter<void>();
  @Output() emplyeeData = new EventEmitter<EmployeeModelInterface>();

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    phone: this.fb.control('', [Validators.required]),
    address: this.fb.control('', []),
    city: this.fb.control('', []),
    state: this.fb.control('', []),
  });
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  triggerParentCloseAddEmployeeFunction() {
    this.close_popup.emit();
  }

  ngOnInit(): void {
    if (this.employee.id) {
      this.validateForm.patchValue(this.employee);
      return;
    }

    const newEmployeeDataString = localStorage.getItem('newEmployeeData');
    if (newEmployeeDataString) {
      const newEmployeeData = JSON.parse(newEmployeeDataString);
      this.validateForm.patchValue(newEmployeeData);
    }

    // Save to localStorage on each value change
    this.validateForm.valueChanges.subscribe((formData) => {
      localStorage.setItem('newEmployeeData', JSON.stringify(formData));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const id = uuidv4();
      console.log('id>', id);
      console.log('submit', this.validateForm.value);
      const {
        name = '',
        email = '',
        phone = '',
        address = '',
        city = '',
        state = '',
      } = this.validateForm.value ?? {};

      if (this.employee.id) {
        this.emplyeeData.emit({
          id: this.employee.id,
          name,
          email,
          phone,
          address,
          state,
          city,
        });
      } else {
        this.emplyeeData.emit({
          id,
          name,
          email,
          phone,
          address,
          state,
          city,
        });
        localStorage.removeItem('newEmployeeData');
      }

      this.close_popup.emit();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // confirmationValidator(control: AbstractControl): ValidationErrors | null {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (control.value !== this.validateForm.controls.password.value) {
  //     return { confirm: true, error: true };
  //   }
  //   return {};
  // }

  // getCaptcha(e: MouseEvent): void {
  //   e.preventDefault();
  // }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); // Prevent default browser save
    }
    if (event.key.toLocaleLowerCase() === 'escape') {
      this.triggerParentCloseAddEmployeeFunction();
    }
  }
}
