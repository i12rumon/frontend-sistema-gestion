import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponentComponent } from "./shared/components/footer-component/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponentComponent, HeaderComponent],
  templateUrl: './app.html',
})
export class App {
  protected title = 'frontend-tfg';
}
