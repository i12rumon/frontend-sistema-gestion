import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormUtils } from '../../../utils/form-utils';
import { RequestService } from '../../service/request.service';
import { CallsMessageResponse } from '../../../shared/interfaces/call-messages-response';
import { UserService } from '../../../user/services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';
import { Plan } from '../../../improvement-plan/interfaces/list-plans.interface';

@Component({
  selector: 'app-create-request',
  imports: [ReactiveFormsModule],
  templateUrl: './create-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRequestComponent  {

  private route = inject(ActivatedRoute);

  fb = inject(FormBuilder);
  router = inject(Router);
  userService = inject(UserService);
  requestService = inject (RequestService);
  planService = inject(ImprovementPlansService);

  message=signal('');
  errorMessage=signal('');
  user = signal<UserItem|null>(null);
  plan = signal<Plan|null>(null);

  planId = this.route.snapshot.paramMap.get('id');

  myForm = this.fb.group({
    detailsFinancing: ['', Validators.required],
    estimatedDate: ['', Validators.required],
    solicitedAmount: ['',[Validators.required, Validators.min(1)]],
    action: ['', Validators.required]
  })

  ngOnInit(){
    this.userService.getProfileUser().subscribe({
      next : (user)=>{
        this.user.set(user);
      }
    })
    this.planService.get_plan(parseInt(this.planId!)).subscribe({
      next: (plan)=>{
        this.plan.set(plan);
      }
    })
  }

  onRegister(){
    this.myForm.markAllAsTouched();
    if (this.myForm.invalid) {
        return;
    }
    console.log(this.planId, this.myForm.value, this.user()?.user_id!);
    this.requestService.createRequest(this.planId!, this.myForm.value, this.user()?.user_id!).subscribe({
      next: (response: CallsMessageResponse)=>{
        this.errorMessage.set('');
        this.message.set(response.message!);
        this.myForm.reset();
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
