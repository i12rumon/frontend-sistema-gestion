import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Plan, Plans } from '../../interfaces/list-plans.interface';
import { ImprovementPlansService } from '../../services/improvement-plans.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-plans-table',
  imports: [RouterLink],
  templateUrl: './plans-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansTableComponent {
  plans = input<Plan[]>();
  borradores = input<boolean>();
  errorMessage=signal('');
  router = inject(Router);
  private planService = inject(ImprovementPlansService);
  generatePDF(plan_id: number){
    this.planService.generatePDF(plan_id).subscribe({
    next: (pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan_${plan_id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error("Error al generar PDF", err);
      this.errorMessage.set("No se pudo generar el PDF");
    }
  });
  }

  approvePlan(plan: Plan){
    const now = new Date().toISOString().split('T')[0];
    this.planService.approvePlan(plan.id).subscribe({
    next: (res) => {
      alert(res.message);
      plan.status = "Aprobado";
    },
    error: (err) => {
      console.error("Error al aprobar plan:", err);
      this.errorMessage.set("No se pudo aprobar el plan");
    }
    });
  }

  viewPlan(id:number){
    this.router.navigateByUrl(`/plans/${id}`);
  }

  createRequest(id:number){
    this.router.navigateByUrl(`/financing/${id}/request`);
  }
}
