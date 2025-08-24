import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CallsService } from '../../services/calls.service';
import { CallForProposal } from '../../../shared/interfaces/calls.interface';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../user/services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';

@Component({
  selector: 'app-list-calls',
  imports: [RouterLink],
  templateUrl: './list-calls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCallsComponent {
  errorMessage=signal('');
  private userService = inject(UserService);
  private callsService = inject(CallsService);
  calls = signal<CallForProposal[]>([]);
  user = signal<UserItem|null>(null);

  ngOnInit(){
    //Cargar el usuario para ver qué iconos tiene visibles
    if(localStorage.getItem('token')){
      this.userService.getProfileUser().subscribe({
        next: (user) =>{
          this.user.set(user);
        }
      })
    }
    this.loadCalls();

  }
  constructor(){
    this.loadCalls();
  }

  private loadCalls() {
    this.callsService.calls().subscribe({
      next: (response) => {
        if(this.user()===null){
          this.calls.set(response.Calls_for_proposals.filter((call: any) => call.status === 'Abierta'));
        }
        else{
          this.calls.set(response.Calls_for_proposals);
        }

      },
      error: (err) =>{
        this.errorMessage.set(err.message);
      }
    })
  }

  closeCall(id: number){
    this.callsService.close_call(id).subscribe({
      next: () => {
        this.loadCalls();
      },
      error: (err) =>{
        this.errorMessage.set(err.message);
      }
    });
  }

}
