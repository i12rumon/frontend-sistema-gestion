import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan, Plans } from '../../interfaces/list-plans.interface';
import { ImprovementPlansService } from '../../services/improvement-plans.service';
import { UserService } from '../../../user/services/user.service';
import {  responseModCreUser } from '../../../shared/interfaces/responseModCre.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-plan-info',
  imports: [NgClass],
  templateUrl: './plan-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanInfoComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  id =parseInt(this.activatedRouter.snapshot.paramMap.get('id')!);
  planService = inject(ImprovementPlansService);
  userService = inject(UserService);
  user = signal<responseModCreUser|null>(null);
  plan = signal<Plan|null>(null);
  ngOnInit(){
    this.planService.get_plan(this.id).subscribe({
      next: (plan) => {
        this.plan.set(plan)
        console.log(this.plan())
      }
    })
  }
}
