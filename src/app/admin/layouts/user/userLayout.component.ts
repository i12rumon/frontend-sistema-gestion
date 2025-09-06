import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'user-layout',
  imports: [RouterOutlet],
  templateUrl: './userLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent { }
