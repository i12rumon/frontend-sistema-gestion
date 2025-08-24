import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModifyComponent } from "../../../user/components/form-modify/form-modify.component";

@Component({
  selector: 'app-create-user',
  imports: [ReactiveFormsModule, FormModifyComponent],
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent{
  private route = inject(ActivatedRoute);
  userId: string | null = null;

  constructor() {
    this.userId = this.route.snapshot.paramMap.get('user_id');
  }
}
