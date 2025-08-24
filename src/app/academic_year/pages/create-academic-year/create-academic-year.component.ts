import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AcademicYearService } from '../../service/academic-year.service';
import { FormUtils } from '../../../utils/form-utils';
import { responseCreate } from '../../../shared/interfaces/response-create-user';

@Component({
  selector: 'app-create-academic-year',
  imports: [ReactiveFormsModule],
  templateUrl: './create-academic-year.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAcademicYearComponent {
  message = signal('');
  errorMessage=signal('');
  fb=inject(FormBuilder);
  router= inject(Router);
  private academicYearService=inject(AcademicYearService);
  myForm : FormGroup = this.fb.group({
    year: ['',[Validators.required, Validators.pattern(FormUtils.academicYearPattern)]]
  })

  onRegister(){
    if(this.myForm.valid){
      const year=this.myForm.value.year;
      this.academicYearService.set_active_academic_year(year).subscribe({
        next: (response: responseCreate)=>{
          this.errorMessage.set('');
          this.message.set(response.message);
          this.myForm.reset();
        },
        error: (error)=>{
          this.errorMessage.set(error?.error?.Error || 'Error desconocido');
          this.message.set('');
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
