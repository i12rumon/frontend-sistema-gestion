import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-button',
  imports: [],
  templateUrl: './cancel-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelButtonComponent {

  route = input.required<string>();
  router = inject(Router);

  onClick(){
    this.router.navigateByUrl(this.route());
  }
}
