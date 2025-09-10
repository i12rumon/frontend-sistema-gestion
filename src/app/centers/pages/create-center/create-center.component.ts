import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { responseCreate } from '../../../shared/interfaces/response-create-user';
import { FormUtils } from '../../../utils/form-utils';
import { responseModCreDegree } from '../../../shared/interfaces/responseModCre.interface';
import { CancelButtonComponent } from "../../../shared/components/cancel-button/cancel-button.component";
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';

@Component({
  selector: 'app-create-center',
  imports: [ReactiveFormsModule, CancelButtonComponent],
  templateUrl: './create-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCenterComponent {
  private route = inject(ActivatedRoute);
  message=signal('');
  errorMessage=signal('');
  fb= inject(FormBuilder);
  router= inject(Router);
  private dataService = inject(DataService);
  private improvementPlansService = inject(ImprovementPlansService);
  degree = signal<responseModCreDegree|null>(null);
  myForm : FormGroup = this.fb.group({
    type: ['', [Validators.required]],
    name: ['',[Validators.required],],
  })
  ngOnInit(){
    const id= this.route.snapshot.paramMap.get('degree_id');
    if(id){
      this.dataService.getDegree(id).subscribe({
        next: ((data)=>{
          this.degree.set(data);
          this.improvementPlansService.nPlans().subscribe({
          next: (plans) => {
            const exists = plans.plans.some(
              (plan) => plan.degree_id === data.data.degree_id
            );
            if (exists) {
              this.myForm.get('name')?.disable();
              this.myForm.get('type')?.disable();
              this.errorMessage.set(
                'Este centro/título tiene planes de mejora asociados y no puede modificarse. Debe salir de esta vista.'
              );
            }
          }
          });
        })
      })
    }
  }

  onRegister(){
    if(this.degree()==null){
      this.myForm.markAllAsTouched();
      if (this.myForm.invalid) {
        return;
      }
      this.dataService.create(this.myForm.value.name, this.myForm.value.type).subscribe({
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
    else{
      const degree = this.degree()?.data.degree_id;
      if (!degree ) {
        this.errorMessage.set('No se puede modificar: grado no cargado');
        return;
      }
      this.dataService.modifyDegree(degree, this.myForm.value.name, this.myForm.value.type).subscribe({
        next: (response: responseModCreDegree)=>{
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
  }

  isInvalid(field:string): boolean {
    return FormUtils.isValidField(this.myForm, field) ?? false;
  }

  getErrorText(field: string): string|null{
    const control = this.myForm.get(field);
    return control && control.errors ? FormUtils.getTextError(control.errors) : null;
  }
}
