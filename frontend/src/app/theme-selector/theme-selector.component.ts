import {Component} from '@angular/core';
import {ThemeEnum, ThemeManagerService} from "../services/theme-manager/theme-manager.service";

@Component({
  selector: 'theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent {

  public ThemeEnum = ThemeEnum;

  get selectedTheme(): ThemeEnum {
    return this.ThemeManagerService.activeTheme;
  }

  set selectedTheme(value: ThemeEnum) {
    this.ThemeManagerService.setTheme(value);
  }

  constructor(private ThemeManagerService: ThemeManagerService) {
  }
}
