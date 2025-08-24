import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-user',
  imports: [],
  templateUrl: './info-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoUserComponent {
  route=inject(ActivatedRoute);
  private userService= inject(UserService);
  user = signal<UserItem|null>(null);
  id: string ='';
  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('user_id')!;
    this.userService.getUser(this.id).subscribe({
      next: (data) => {
        this.user.set(data.data);
    }})
  }
}
