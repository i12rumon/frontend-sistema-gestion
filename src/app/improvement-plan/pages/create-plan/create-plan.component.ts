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
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AcademicYearService } from '../../../academic_year/service/academic-year.service';
import { UserService } from '../../../user/services/user.service';
@Component({
  selector: 'app-create-plan',
  imports: [ReactiveFormsModule],
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

  ngOnInit(){
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.id_user.set(data.user_id);
    }})
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
        objectives: ['', [Validators.required]],
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
          description: action.description,
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
        })),
      };
      this.planService.create_plan(plan).subscribe({
        next: () => {
          this.router.navigateByUrl(`/plans`);
        },
        error: (error)=>{
          this.errorMessage.set(error?.error?.Error);
        }
      });
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

  generatePDF(){

  }
}
