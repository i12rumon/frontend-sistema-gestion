import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserItem } from '../../../shared/interfaces/user-item.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private router = inject(Router);
  private userService= inject(UserService);
  user = signal<UserItem|null>(null);
  ngOnInit(): void {
    this.userService.getProfileUser().subscribe({
      next: (data) => {
        this.user.set(data);
    }})
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl("login");
  }

  modify(){
    this.router.navigateByUrl("modify-profile");
  }
}
