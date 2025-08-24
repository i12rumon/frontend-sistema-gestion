import { ChangeDetectionStrategy, Component, inject, OnInit, runInInjectionContext, signal } from '@angular/core';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { UserService } from '../../../user/services/user.service';
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';
import { AcademicYearService } from '../../../academic_year/service/academic-year.service';
import { NavBarAdministratorComponent } from "../../../admin/components/nav-bar-administrator/nav-bar-administrator.component";
import { NavBarServiceComponent } from "../../components/nav-bar-service/nav-bar-service.component";
import { CallsService } from '../../../calls_for_proposals/services/calls.service';

@Component({
  selector: 'app-home-service',
  imports: [ NavBarServiceComponent],
  templateUrl: './home-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeServiceComponent implements OnInit {
  infoUser = signal<UserItem | null>(null);
  nPlans = signal<number>(0);
  userService = inject(UserService);
  planService = inject(ImprovementPlansService);
  callService = inject(CallsService);
  callActive = signal('');
  ngOnInit() {
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.infoUser.set(data);
      },
    });
    this.planService.plans().subscribe({
      next: (data) =>{
        this.nPlans.set(data.plans.length)
      }
    })
    this.callService.calls().subscribe({
      next: (data) =>{
        const activeYear = data.Calls_for_proposals.find((call) => call.status==='Abierta');
        if(activeYear){
          this.callActive.set(`${activeYear.start_date} - ${activeYear.end_date}`);
        }
      }
    })
  }
}
