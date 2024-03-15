import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NumberInputComponent } from './number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TimeInputComponent } from './time-input/time-input.component';
import { NumberDisplayComponent } from './number-display/number-display.component';
import { TimeDisplayComponent } from './time-display/time-display.component';

@NgModule({
  declarations: [
    AppComponent,
    NumberInputComponent,
    TimeInputComponent,
    NumberDisplayComponent,
    TimeDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    DecimalPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'en-US' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translateService: TranslateService) {
  return () => {
    translateService.addLangs(['en-US', 'en-GB', 'fr', 'es', 'de-DE', 'pl']);
    translateService.setDefaultLang('en-US');

    translateService.use(translateService.getBrowserCultureLang()!);
  };
}
