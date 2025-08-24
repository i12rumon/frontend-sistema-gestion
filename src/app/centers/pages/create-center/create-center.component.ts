import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { responseCreate } from '../../../shared/interfaces/response-create-user';
import { FormUtils } from '../../../utils/form-utils';
import { responseModCreDegree } from '../../../shared/interfaces/responseModCre.interface';

@Component({
  selector: 'app-create-center',
  imports: [ReactiveFormsModule],
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
