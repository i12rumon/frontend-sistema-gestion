import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CallFormComponent } from "../../components/call-form/call-form.component";
import { ActivatedRoute } from '@angular/router';
import { CallsService } from '../../services/calls.service';
import { CallForProposal } from '../../../shared/interfaces/calls.interface';

@Component({
  selector: 'app-modify-calls',
  imports: [CallFormComponent],
  templateUrl: './modify-calls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyCallsComponent {
  private route = inject(ActivatedRoute);
  call_id: string | null = null;
  call = signal<CallForProposal|null>(null);
  callService = inject(CallsService);
  constructor() {
    this.call_id = this.route.snapshot.paramMap.get('id');
    if(this.call_id){
      this.callService.calls().subscribe({
        next: (response) => {
          const found = response.Calls_for_proposals.find(c => c.id === +this.call_id!);
          if (found) {
            this.call.set(found);
          }
        },
        error: (err) => {
          console.error('Error cargando convocatorias', err);
        }
      });
    }
  }
}

