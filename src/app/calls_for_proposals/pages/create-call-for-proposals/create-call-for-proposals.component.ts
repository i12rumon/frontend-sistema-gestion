import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallsService } from '../../services/calls.service';
import { CallsMessageResponse } from '../../../shared/interfaces/call-messages-response';
import { FormUtils } from '../../../utils/form-utils';
import { CallFormComponent } from "../../components/call-form/call-form.component";

@Component({
  selector: 'app-create-call-for-proposals',
  imports: [ReactiveFormsModule, CallFormComponent],
  templateUrl: './create-call-for-proposals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCallForProposalsComponent {
}
