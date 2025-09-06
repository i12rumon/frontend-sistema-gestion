import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { CallForProposal } from '../../../shared/interfaces/calls.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallsService } from '../../services/calls.service';
import { CallsMessageResponse } from '../../../shared/interfaces/call-messages-response';
import { FormUtils } from '../../../utils/form-utils';
import { parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { CancelButtonComponent } from "../../../shared/components/cancel-button/cancel-button.component";

@Component({
  selector: 'app-call-form',
  imports: [ReactiveFormsModule, CancelButtonComponent],
  templateUrl: './call-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallFormComponent {
  call = input<CallForProposal|null>();
  message = signal('');
  errorMessage=signal('');
  fb=inject(FormBuilder);
  router= inject(Router);
  private callsService=inject(CallsService);
  myForm : FormGroup = this.fb.group({
    title: ['',Validators.required],
    description: ['',Validators.required],
    start_date: ['',Validators.required],
    end_date: ['',Validators.required],
  })

  constructor() {
    effect(() => {
      const call = this.call();
      if (call) {
        this.patchForm(call);
      }
    });
  }

  onRegister(){
    if(this.call()==null){
      this.myForm.markAllAsTouched();
      if (this.myForm.invalid) {
          return;
      }
      const value=this.myForm.value;
      this.callsService.create_calls(value).subscribe({
        next: (response: CallsMessageResponse)=>{
          this.errorMessage.set('');
          this.message.set(response.message!);
          this.myForm.reset();
        },
        error: (error)=>{
          this.errorMessage.set(error?.error?.Error || 'Error desconocido');
          this.message.set('');
        }
      })
    }
    else{
      const call_id = this.call()?.id;
      const data = {
        title: this.myForm.value.title,
        start_date: this.myForm.value.start_date,
        end_date: this.myForm.value.end_date,
        description: this.myForm.value.description
      };
      if(!call_id){
        this.errorMessage.set('No se puede modificar: convocatoria no cargada');
        return;
      }
      this.callsService.modify_call(call_id,data).subscribe({
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
      this.router.navigateByUrl("/calls-for-proposals");
    }

  }

  isInvalid(field:string): boolean {
    return FormUtils.isValidField(this.myForm, field) ?? false;
  }

  getErrorText(field: string): string|null{
    const control = this.myForm.get(field);
    return control && control.errors ? FormUtils.getTextError(control.errors) : null;
  }

  private toISO(dateString: string): string {
    const parsed = parse(dateString, "d 'de' MMMM 'de' yyyy", new Date(), { locale: es });
  return new Date(parsed).toISOString().split('T')[0];
}

  private patchForm(call: CallForProposal) {
      this.myForm.patchValue({
        title: call.title,
        start_date: this.toISO(call.start_date),
        end_date: this.toISO(call.end_date),
        description: call.description,
      });
    }
}
