import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { FormModifyComponent } from "../../components/form-modify/form-modify.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-profile',
  imports: [FormModifyComponent],
  templateUrl: './modify-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyProfileComponent implements OnInit{
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  id= this.route.paramMap
  user = signal<UserItem|null>(null);
  ngOnInit(){
    this.userService.getProfileUser().subscribe({
      next: (response) =>{
        this.user.set(response);
      }
    })

  }
}
