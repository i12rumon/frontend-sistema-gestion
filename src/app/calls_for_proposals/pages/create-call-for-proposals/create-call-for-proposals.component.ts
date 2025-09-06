import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CallFormComponent } from "../../components/call-form/call-form.component";

@Component({
  selector: 'app-create-call-for-proposals',
  imports: [ReactiveFormsModule, CallFormComponent],
  templateUrl: './create-call-for-proposals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCallForProposalsComponent {
}
