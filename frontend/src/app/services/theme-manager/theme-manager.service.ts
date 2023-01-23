import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {

  public activeTheme: ThemeEnum = ThemeEnum.INDIGO_PINK;

  public setTheme(theme: ThemeEnum): void {
    let linkElementForKey: HTMLLinkElement;

    switch (theme) {
      case ThemeEnum.INDIGO_PINK:
        // Since this is the default theme, we just need to remove previous theme class
        this.removeCurrentThemeClassFromBodyElement();
        break;

      case ThemeEnum.DEEP_PURPLE:
        linkElementForKey = this.getLinkElementForKey('light-deeppurple-amber');
        linkElementForKey.setAttribute('href', '/light-deeppurple-amber.css');
        this.removeCurrentThemeClassFromBodyElement();
        // Use new one
        document.body.classList.add('light-deeppurple-amber');
        break;

      case ThemeEnum.PINK_BLUE:
        linkElementForKey = this.getLinkElementForKey('dark-pink-blue-grey');
        linkElementForKey.setAttribute('href', '/dark-pink-blue-grey.css');
        this.removeCurrentThemeClassFromBodyElement();
        // Use new one
        document.body.classList.add('dark-pink-blue-grey');
        break;

      case ThemeEnum.PURPLE_GREEN:
        linkElementForKey = this.getLinkElementForKey('dark-purple-green');
        linkElementForKey.setAttribute('href', '/dark-purple-green.css');
        this.removeCurrentThemeClassFromBodyElement();
        // Use new one
        document.body.classList.add('dark-purple-green');
        break;
    }

    this.activeTheme = theme;
  }

  private removeCurrentThemeClassFromBodyElement(): void {
    switch (this.activeTheme) {
      case ThemeEnum.DEEP_PURPLE:
        document.body.classList.remove('light-deeppurple-amber');
        break;
      case ThemeEnum.PINK_BLUE:
        document.body.classList.remove('dark-pink-blue-grey');
        break;
      case ThemeEnum.PURPLE_GREEN:
        document.body.classList.remove('dark-purple-green');
        break;
      case ThemeEnum.INDIGO_PINK:
      default:
        // Nothing to remove
    }
  }

  private getLinkElementForKey(key: string): HTMLLinkElement {
    return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
  }

  private getExistingLinkElementByKey(key: string): HTMLLinkElement {
    return document.head.querySelector(
      `link[rel="stylesheet"].${this.getClassNameForKey(key)}`
    );
  }

  private createLinkElementWithKey(key: string): HTMLLinkElement {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
  }

  private getClassNameForKey(key: string): string {
    return `style-manager-${key}`;
  }
}

export enum ThemeEnum {
  DEEP_PURPLE,
  INDIGO_PINK,
  PINK_BLUE,
  PURPLE_GREEN
}
