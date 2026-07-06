import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  /** When true the footer is offset to clear the fixed 280px sidebar */
  @Input() offsetSidebar = false;
}
