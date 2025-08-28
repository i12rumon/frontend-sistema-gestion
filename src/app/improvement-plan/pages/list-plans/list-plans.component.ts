import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Plan } from '../../interfaces/list-plans.interface';
import { ImprovementPlansService } from '../../services/improvement-plans.service';
import { PlansTableComponent } from "../../components/plans-table/plans-table.component";
import { UserService } from '../../../user/services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { DataService } from '../../../centers/services/data.service';
import { Degree } from '../../../shared/interfaces/degree.interface';

@Component({
  selector: 'app-list-plans',
  imports: [ PlansTableComponent],
  templateUrl: './list-plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPlansComponent {
  errorMessage=signal('');
  private planService = inject(ImprovementPlansService);
  userService = inject(UserService);
  dataService = inject(DataService);
  degree = signal<Degree[]>([]);
  user = signal<UserItem | null >(null);
  plans = signal<Plan[]|null>(null);
  constructor(){
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.user.set(data);
        if(this.user()?.role_id===3){
          this.planService.plans().subscribe({
            next: (response) => {
              this.plans.set(response.plans);
            },
            error: (err) =>{
              this.errorMessage.set(err.message)
            }
          })
        }

        if(this.user()?.role_id===2){
          this.planService.nPlans().subscribe({
            next: (response) => {
              console.log(response.plans)
              this.plans.set(response.plans);
            },
            error: (err) =>{
              this.errorMessage.set(err.message)
            }
          })
        }
      },
    });

  }
}
