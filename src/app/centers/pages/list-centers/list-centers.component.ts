import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { RouterLink } from '@angular/router';
import { Degree } from '../../../shared/interfaces/degree.interface';

@Component({
  selector: 'app-list-centers',
  imports: [RouterLink],
  templateUrl: './list-centers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCentersComponent {
  errorMessage=signal('');

  private dataService = inject(DataService);
  degrees = signal<Degree[]>([]);

  constructor(){
    this.dataService.degrees().subscribe({
      next: (response) => {
        this.degrees.set(response.degrees);
      },
      error: (err) =>{
        this.errorMessage.set(err.message);
      }
    })
  }
  deleteDegree(id: number){
    this.dataService.deleteDegree(id).subscribe({
      next: () => {
        this.degrees.set(this.degrees().filter(degree => degree.degree_id !== id));
      },
      error: (err) =>{
        this.errorMessage.set(err.error?.Error );
      }
    })
  }
}
