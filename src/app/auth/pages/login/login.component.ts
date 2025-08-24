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

  onLogin(){
    this.myForm.markAllAsTouched();
    if(this.myForm.invalid){
      return;
    }
    this.userService.login(this.myForm.value.username,this.myForm.value.password).subscribe({
      next: (response)=>{
        //Guardado de token en local Storage y redirección
        localStorage.setItem('token',response.token);
        if (response.role===1){
            this.router.navigate(['/admin']);
        }
        if (response.role===2){
            this.router.navigate(['/service']);
        }
        if (response.role===3){
            this.router.navigate(['/responsable']);
        }
      },
      error: (error)=>{
        this.errorMessage.set(error?.error?.Error || 'Error desconocido');
      }
    })
  }

  isInvalid(field:string): boolean {
    return FormUtils.isValidField(this.myForm, field) ?? false;
  }

  getErrorText(field: string): string|null{
    const control = this.myForm.get(field);
    return control && control.errors ? FormUtils.getTextError(control.errors) : null;
  }
}
