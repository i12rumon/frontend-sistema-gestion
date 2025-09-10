import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DataService } from '../../../centers/services/data.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { Degree } from '../../../shared/interfaces/degree.interface';
import { FormUtils } from '../../../utils/form-utils';
import { Degrees } from '../../../shared/interfaces/degrees.interface';
import { responseCreate } from '../../../shared/interfaces/response-create-user';
import { CancelButtonComponent } from "../../../shared/components/cancel-button/cancel-button.component";
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';

@Component({
  selector: 'app-form-modify',
  imports: [ReactiveFormsModule, CancelButtonComponent],
  templateUrl: './form-modify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModifyComponent {
  userId = input<string|null>()
  message=signal('');
  errorMessage=signal('');
  fb= inject(FormBuilder);
  router= inject(Router);
  private userService= inject(UserService);
  private dataService = inject(DataService);
  private improvementPlansService = inject(ImprovementPlansService);
  user = signal<UserItem|null>(null);
  degrees = signal<Degree[]>([]);
  myForm : FormGroup = this.fb.group({
    email: ['', [Validators.required,Validators.pattern(FormUtils.emailPattern)]],
    name: ['',[Validators.required],],
    username: ['',[Validators.required],],
    password: ['', Validators.required],
    validatePassword: ['', Validators.required],
    degree: ['',Validators.required]
  })
  ngOnInit(){

    this.dataService.degrees().subscribe({
      next: (response: Degrees)=>{
        this.degrees.set(response.degrees);
      },
      error: (error)=>{
        this.errorMessage.set(error?.error?.Error || 'Error desconocido');
      }
    })

    if(this.userId()){
      this.userService.getUser(this.userId()!).subscribe({
        next: ((response)=>{
          this.user.set(response.data);
          this.patchForm(response.data);
          this.myForm.get('password')?.clearValidators();
          this.myForm.get('password')?.updateValueAndValidity();
        })
      })
    }
    if(this.router.url.includes('modify-profile')){
      this.userService.getProfileUser().subscribe({
        next:(response) =>{
          this.user.set(response);
          this.patchForm(response);
          this.myForm.get('password')?.clearValidators();
          this.myForm.get('password')?.updateValueAndValidity();
          this.myForm.get('validatePassword')?.clearValidators();
          this.myForm.get('validatePassword')?.updateValueAndValidity();
          this.improvementPlansService.plans().subscribe({
            next: (plansResponse) => {
              const hasPlans = plansResponse.plans.some(plan => plan.user_id === response.user_id);
              if (hasPlans) {
                this.myForm.get('degree')?.disable();
              }
            },
            error: () => {
              this.errorMessage.set('No se pudo comprobar si el usuario tiene planes de mejora.');
            }
          });
        }
      })
    }
  }
  onRegister(){
    if(this.user()==null){
      this.myForm.markAllAsTouched();
      if(this.myForm.value.password.trim()===this.myForm.value.validatePassword.trim()){
        this.userService.register(this.myForm.value.email,this.myForm.value.name, this.myForm.value.username, this.myForm.value.password, this.myForm.value.degree).subscribe({
          next: (response: responseCreate)=>{
            this.errorMessage.set('');
            this.message.set(response.message);
            this.myForm.reset();
          },
          error: (error)=>{
            this.errorMessage.set(error?.error?.Error || 'Error desconocido');
          }
        })
      }
    }
    else{
      const user = this.user()?.user_id;
      const data = {
        email: this.myForm.value.email,
        name: this.myForm.value.name,
        username: this.myForm.value.username,
        degree: this.myForm.value.degree,
        password: this.myForm.value.password,
      };
        if (!user) {
          this.errorMessage.set('No se puede modificar: usuario no cargado');
          return;
        }
        if(this.myForm.value.password.trim()===this.myForm.value.validatePassword.trim()){
          this.userService.modifyUser(user, data).subscribe({
            next: (response)=>{
              this.errorMessage.set('');
              if(response.message){
                this.message.set(response.message);
              }
              this.myForm.reset();
            },
            error: (error)=>{
              this.errorMessage.set(error?.error?.Error || 'Error desconocido');
            }
          })
        }
        else{
          this.errorMessage.set('No se puede modificar: las contraseñas no coinciden');
          return;
        }
    }
  }

  isInvalid(field:string): boolean {
    return FormUtils.isValidField(this.myForm, field) ?? false;
  }

  getErrorText(field: string): string|null{
    const control = this.myForm.get(field);
    return control && control.errors ? FormUtils.getTextError(control.errors) : null;
  }

  private patchForm(user: UserItem) {
    this.myForm.patchValue({
      email: user.email,
      name: user.name,
      username: user.username,
      degree: user.degree,
    });
  }

}
