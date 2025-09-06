import { ChangeDetectionStrategy, Component, createPlatform, inject, OnInit, runInInjectionContext, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { UserService } from '../../../user/services/user.service';
import { AuthService } from '../../services/auth.service';

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
  authService = inject(AuthService);
  role = signal<string>('');
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
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      const role = this.authService.getRole();
      switch (role) {
        case "ADMIN":
          this.router.navigate(['/admin']);
          break;
        case "QUALITY":
          this.router.navigate(['/service']);
          break;
        case "RESPONSABLE":
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
