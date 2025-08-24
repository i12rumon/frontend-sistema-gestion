import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PlansTableComponent } from "../../components/plans-table/plans-table.component";
import { ImprovementPlansService } from '../../services/improvement-plans.service';
import { Plan } from '../../interfaces/list-plans.interface';

@Component({
  selector: 'app-list-plans-service',
  imports: [PlansTableComponent],
  templateUrl: './list-plans-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPlansServiceComponent {
  errorMessage=signal('');
  private planService = inject(ImprovementPlansService);
  plans = signal<Plan[]|null>(null);
  constructor(){
    this.planService.plans().subscribe({
      next: (response) => {
        this.plans.set(response.plans)
      },
      error: (err) =>{
        this.errorMessage.set(err.message)
      }
    })
  }
}
