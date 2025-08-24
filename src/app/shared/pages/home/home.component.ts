import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBarHomeComponent } from "../../components/nav-bar-home/nav-bar-home.component";

@Component({
  selector: 'app-home',
  imports: [NavBarHomeComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { }
