import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar-administrator',
  imports: [UpperCasePipe, RouterLink],
  templateUrl: './nav-bar-administrator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarAdministratorComponent { }
