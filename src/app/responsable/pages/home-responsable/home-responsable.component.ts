import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { UserService } from '../../../user/services/user.service';
import { NavBarResponsableComponent } from "../../components/nav-bar-responsable/nav-bar-responsable.component";
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';

@Component({
  selector: 'app-home-responsable',
  imports: [NavBarResponsableComponent],
  templateUrl: './home-responsable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeResponsableComponent {
  infoUser = signal<UserItem | null>(null);
  nPlans = signal<number>(0);
  userService = inject(UserService);
  planService = inject(ImprovementPlansService);
  ngOnInit() {
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.infoUser.set(data);
      },
    });
    this.planService.plans().subscribe({
      next: (plans) =>{
        this.nPlans.set(plans.plans.length);
      }
    })
  }
}
