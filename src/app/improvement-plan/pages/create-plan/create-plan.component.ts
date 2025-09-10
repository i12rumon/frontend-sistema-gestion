import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImprovementPlansService } from '../../services/improvement-plans.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AcademicYearService } from '../../../academic_year/service/academic-year.service';
import { UserService } from '../../../user/services/user.service';
import { CancelButtonComponent } from "../../../shared/components/cancel-button/cancel-button.component";
@Component({
  selector: 'app-create-plan',
  imports: [ReactiveFormsModule, CancelButtonComponent],
  templateUrl: './create-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CreatePlanComponent {
  criteriosImplanta = [
    '1. Información Pública',
    '2. Política de aseguramiento de la calidad',
    '3. Personal docente e investigador',
    '4. Gestión de Recursos materiales y servicios',
    '5. Gestión y Resultados de los procesos de enseñanza-aprendizaje'
  ];
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  errorMessage= signal<string>('');
  planService = inject(ImprovementPlansService);
  userService = inject (UserService);
  fb = inject(FormBuilder);
  id_user = signal<number>(0);
  yearActive = signal('');
  yearService = inject(AcademicYearService);
  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    actions: this.fb.array([]),
  });
  plan_id = signal<number|null>(null);
  isEdit = false;

  ngOnInit(){
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.id_user.set(data.user_id);
    }})

    this.plan_id.set(Number(this.activatedRoute.snapshot.paramMap.get('id')));
    if(this.plan_id()){
      this.isEdit = true;
      this.loadPlan(this.plan_id()!);
    }
  }

  getYearActiveAndValidate() {
  this.yearService.academic_years().subscribe((data) => {
    const activeYear = data.academic_years.find((y) => y.is_active);
    if (activeYear) {
      this.yearActive.set(activeYear.year);

      this.planService.nPlans().subscribe((plans) => {
        const exists = plans.plans.some(
          (p) => p.academic_year === activeYear.year
        );

        if (exists) {
          // bloqueamos formulario y mostramos mensaje
          this.myForm.disable();
          this.errorMessage.set(
            `Ya existe un plan de mejora para el curso ${activeYear.year}. No es posible crear otro.`
          );
        }
      });
    }
  });
  }

  get actions() {
    return this.myForm.get('actions') as FormArray;
  }

  getYearActive(){
    this.yearService.academic_years().subscribe(
      (data: any) => {
        this.yearActive = data.find((year: any) => year.active);
        }
      );
  }

  getIndicators(action: number) {
    return this.actions.at(action).get('indicators') as FormArray;
  }

  addAction() {
    this.actions.push(
      this.fb.group({
        name_action: ['', [Validators.required]],
        origin: ['', [Validators.required]],
        accua_recommendations: [''],
        criterios: [[], [Validators.required]],
        description_action: ['', [Validators.required]],
        scope: [''],
        objectives: ['', [Validators.required]],
        priority: [''],
        start_date: [null],
        end_date: [null],
        indicators: this.fb.array([]),
      })
    );
  }

  removeAction(index: number) {
    this.actions.removeAt(index);
  }

  addIndicator(action: number) {
    const indicators = this.getIndicators(action);
    indicators.push(
      this.fb.group({
        name: ['', [Validators.required]],
        start_value: ['', [Validators.required]],
        objective_value: ['', [Validators.required]],
      })
    );
  }

  removeIndicator(action: number, indicator: number) {
    const indicators = this.getIndicators(action);
    indicators.removeAt(indicator);
  }

  onSubmit() {
    if (this.myForm.valid) {
      const plan = {
        name: this.myForm.value.name,
        user_id: this.id_user() ?? '0',
        create_date:new Date().toISOString().split("T")[0],
        description: this.myForm.value.description,
        actions: this.myForm.value.actions.map((action: any) => ({
          name: action.name_action,
          origin: action.origin,
          accua_recommendations: action.accua_recommendations,
          criterios: action.criterios,
          description: action.description_action,
          scope: action.scope,
          objectives: action.objectives,
          priority: action.priority,
          start_date: action.start_date || null,
          end_date: action.end_date || null,
          indicators: (action.indicators || []).map((ind: any) => ({
            name: ind.name,
            start_value: ind.start_value,
            objective_value: ind.objective_value,
          })),
        }))
      };
      if(this.isEdit && this.plan_id()){
        this.planService.update_plan(this.plan_id()!,plan).subscribe({
          next: () => {
            this.router.navigateByUrl(`/plans`);
          },
          error: (error)=>{
            console.log(error);
            this.errorMessage.set(error?.error?.Error);
          }
        });
      }
      else{
        this.planService.create_plan(plan).subscribe({
          next: () => {
            this.router.navigateByUrl(`/plans`);
          },
          error: (error)=>{
            this.errorMessage.set(error?.error?.Error);
          }
        });
      }
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  onCriterioChange(event: any, actionIndex: number, criterio: string) {
    const control = (this.actions.at(actionIndex) as FormGroup).get('criterios');
    const selected = control?.value as string[];

    if (event.target.checked) {
      control?.setValue([...selected, criterio]);
    } else {
      control?.setValue(selected.filter(c => c !== criterio));
    }

    control?.markAsTouched();
  }

  loadPlan(planId: number) {
  this.planService.get_plan(planId).subscribe((plan) => {
    this.myForm.patchValue({
      name: plan.name,
      description: plan.description,
    });

    plan.actions.forEach((action) => {
      const actionGroup = this.fb.group({
        id: [action.id],
        name_action: [action.name, Validators.required],
        origin: [action.origin, Validators.required],
        accua_recommendations: [action.accua_recommendations || ''],
        criterios: [action.criterios || [], Validators.required],
        description_action: [action.description, Validators.required],
        scope: [action.scope || ''],
        start_date: [action.start_date || null],
        end_date: [action.end_date || null],
        objectives: [action.objectives, Validators.required],
        priority: [action.priority || ''],
        indicators: this.fb.array([]),
      });

      const indicatorsArray = actionGroup.get('indicators') as FormArray;
      action.indicators.forEach((ind: any) => {
        indicatorsArray.push(
          this.fb.group({
            id: [ind.id],
            name: [ind.name, Validators.required],
            start_value: [ind.start_value, Validators.required],
            objective_value: [ind.objective_value, Validators.required],
          })
        );
      });

      this.actions.push(actionGroup);
    });
  });
}

}
