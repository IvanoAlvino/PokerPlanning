import {Component, Input} from '@angular/core';

@Component({
  selector: 'theme-icon',
  templateUrl: './theme-icon.component.html'
})
export class ThemeIconComponent {
  @Input()
  public backgroundColor: string;

  @Input()
  public iconButtonColor: string;

  @Input()
  public iconToolbarColor: string;
}
