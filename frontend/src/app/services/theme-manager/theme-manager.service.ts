import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {

  /**
   * The key used to store the chosen theme in local storage.
   */
  private static readonly SAVED_THEME: string = "saved_theme_id";

  /**
   * The currently active theme.
   */
  public activeTheme: ThemeEnum = ThemeEnum.INDIGO_PINK;

  /**
   * Set the given theme as the active one.
   * @param theme The theme to set as active
   */
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

    localStorage.setItem(ThemeManagerService.SAVED_THEME, theme.toString());
    this.activeTheme = theme;
  }

  /**
   * Remove the current class from the body element that is actually specifying the theme css to load.
   */
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

  /**
   * Find or create the <link> html element with the classname containing the given key.
   * @param key The string that will allow to select a specific html link element.
   */
  private getLinkElementForKey(key: string): HTMLLinkElement {
    return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
  }

  /**
   * Get the <link> html element with the classname containing the given key.
   * @param key The string that will allow to select a specific html link element.
   */
  private getExistingLinkElementByKey(key: string): HTMLLinkElement {
    return document.head.querySelector(
      `link[rel="stylesheet"].${this.getClassNameForKey(key)}`
    );
  }

  /**
   * Create a link element with a class containing the given key.
   * @param key A string that will end up in a class in the html link element.
   */
  private createLinkElementWithKey(key: string): HTMLLinkElement {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
  }

  /**
   * Elaborate the given key and create a unique class name.
   * @param key The string to use in the class name.
   */
  private getClassNameForKey(key: string): string {
    return `style-manager-${key}`;
  }

  /**
   * Look for existing settings saved in local storage and load the theme.
   */
  public loadSavedTheme(): void {
    const savedThemeId = localStorage.getItem(ThemeManagerService.SAVED_THEME);
    if (savedThemeId) {
      this.setTheme(parseInt(savedThemeId));
    }
  }
}

export enum ThemeEnum {
  DEEP_PURPLE,
  INDIGO_PINK,
  PINK_BLUE,
  PURPLE_GREEN
}
