import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AcademicYearService } from '../../service/academic-year.service';
import { AcademicYears } from '../../interfaces/academic_years.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-academic-year',
  imports: [RouterLink],
  templateUrl: './list-academic-year.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAcademicYearComponent {
  errorMessage = signal('');
  private academicYearService = inject(AcademicYearService);
  academic_years = signal<AcademicYears | null>(null);

  constructor() {
    this.academicYearService.academic_years().subscribe({
      next: (data) => {
        this.academic_years.set(data);
      },
      error: (error) => {
        this.errorMessage.set(error);
      },
    });
  }
}
