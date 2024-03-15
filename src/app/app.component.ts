import { Component, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeDe from '@angular/common/locales/de';
import localePl from '@angular/common/locales/pl';
import localeEnGb from '@angular/common/locales/en-GB';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEs, 'es');
registerLocaleData(localeDe, 'de-DE');
registerLocaleData(localePl, 'pl');
registerLocaleData(localeEnGb, 'en-GB');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'numbers';

  availableLanguages: string[] = [];
  currentLanguage: string = 'en-US';

  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    public translateService: TranslateService,
    private router: Router) {
      this.availableLanguages = this.translateService.getLangs();
      this.currentLanguage = this.translateService.currentLang;
  }

  onLanguageChange(language: string): void{
    this.translateService.use(language);
    this.localeId = language;
    this.currentLanguage = language;

    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
