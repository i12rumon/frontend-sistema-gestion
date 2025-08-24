import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nav-bar-home',
  imports: [UpperCasePipe,RouterLink],
  templateUrl: './nav-bar-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarHomeComponent { }
