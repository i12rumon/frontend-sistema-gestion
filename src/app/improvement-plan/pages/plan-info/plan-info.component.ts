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
  ngOnInit() {
  this.planService.get_plan(this.id).subscribe({
    next: (plan) => {
      plan.actions.forEach(action => {
        console.log( action.criterios);
        if (typeof action.criterios === 'string') {
            action.criterios = this.normalizeCriterios(action.criterios);
        }
      });

      this.plan.set(plan);
    }
  });
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  normalizeCriterios(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {

    const joined = value.join('').trim();
    return [joined];
  }

  if (typeof value === 'string') {
    return [value.trim()];
  }

  return [String(value)];
}
}
