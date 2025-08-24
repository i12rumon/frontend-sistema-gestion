import { ChangeDetectionStrategy, Component, createPlatform, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoginComponent {
  errorMessage=signal('');
  fb= inject(FormBuilder);
  router= inject(Router);
  private userService= inject(UserService);
  myForm : FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

onLogin() {
  this.myForm.markAllAsTouched();
  if (this.myForm.invalid) {
    return;
  }

  this.userService.login(this.myForm.value.username, this.myForm.value.password).subscribe({
    next: (response) => {
      localStorage.setItem('access_token', response.access_token || response.token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }

      // Redirigir según rol
      switch (response.role) {
        case 1:
          this.router.navigate(['/admin']);
          break;
        case 2:
          this.router.navigate(['/service']);
          break;
        case 3:
          this.router.navigate(['/responsable']);
          break;
        default:
          this.router.navigate(['/']);
      }
    },
    error: (error) => {
      this.errorMessage.set(error?.error?.Error || 'Error desconocido');
    }
  });
}

  isInvalid(field:string): boolean {
    return FormUtils.isValidField(this.myForm, field) ?? false;
  }

  getErrorText(field: string): string|null{
    const control = this.myForm.get(field);
    return control && control.errors ? FormUtils.getTextError(control.errors) : null;
  }
}
