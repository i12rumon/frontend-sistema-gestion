import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-list-users',
  imports: [RouterLink],
  templateUrl: './list-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent implements OnInit{
  errorMessage=signal('');
  private userService = inject(UserService);
  users = signal<UserItem[]>([]);

  ngOnInit(){
    this.userService.users().subscribe({
      next: (response) => {
        this.users.set(response.users.filter(user => user.role_id !== "Administrador"));
      },
      error: (err) =>{
        this.errorMessage.set(err.message)
      }
    })
  }

  deleteUser(id: number){
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.set(this.users().filter(user => user.user_id !== id));
      },
      error: (err) =>{
        this.errorMessage.set(err.message)
      }
    });
  }

}
