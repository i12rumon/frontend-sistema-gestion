import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar-service',
  imports: [UpperCasePipe, RouterLink],
  templateUrl: './nav-bar-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarServiceComponent { }
