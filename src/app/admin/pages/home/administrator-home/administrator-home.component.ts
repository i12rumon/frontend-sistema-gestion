import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavBarAdministratorComponent } from "../../../components/nav-bar-administrator/nav-bar-administrator.component";
import { UserService } from '../../../../user/services/user.service';
import { UserItem } from '../../../../shared/interfaces/user-item.interface';
import { DataService } from '../../../../centers/services/data.service';

@Component({
  selector: 'app-administrator-home',
  imports: [NavBarAdministratorComponent],
  templateUrl: './administrator-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministratorHomeComponent {
  userService = inject(UserService);
  dataService = inject(DataService);
  degrees = signal<Number>(0);
  users = signal<Number>(0);
  infoUser=signal<UserItem|null>(null);
  ngOnInit(){
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.infoUser.set(data);
    }})

    this.userService.users().subscribe({
      next: (response) => {
        this.users.set(response.users.length);
      }
    })
    this.dataService.degrees().subscribe({
      next: (response) => {
        this.degrees.set(response.degrees.length);
      }
    })
  }
}

