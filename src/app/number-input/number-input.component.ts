import { NumberFormatStyle, getLocaleNumberFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  selectedLanguage: string = 'en-US';

  currentString: string = '0';
  currentNumber: number = 0;

  valueAsNumber: number = 12345.54321;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;
      })
    });
  }

  onBlur(event: FocusEvent) {
    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      console.log(target.value, target.valueAsNumber);
      this.currentString = target.value;
      console.log(getLocaleNumberFormat('en-US', NumberFormatStyle.Decimal));
      this.valueAsNumber = target.valueAsNumber;
    }
  }

  updateLanguage() {

  }
}
