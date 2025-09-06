import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBarHomeComponent } from '../../components/nav-bar-home/nav-bar-home.component';

@Component({
  selector: 'app-about-us',
  imports: [NavBarHomeComponent],
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent { }
