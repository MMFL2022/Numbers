import { DecimalPipe, NumberFormatStyle, NumberSymbol, getLocaleNumberFormat, getLocaleNumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  selectedLanguage: string = 'en-US';

  valueAsNumber: number = -12345.54321;
  valueAsString: string = '';

  decimalLocaleSymbol: string = '';
  groupLocaleSymbol: string = '';
  minusLocaleSymbol: string = '';
  plusLocaleSymbol: string = '';

  constructor(
    private translateService: TranslateService,
    private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;

        this.decimalLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Decimal);
        this.groupLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Group);
        this.minusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.MinusSign);
        this.plusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.PlusSign);

        let transformedValue = this.decimalPipe.transform(this.valueAsNumber, '', this.selectedLanguage);
        if (transformedValue != null) {
          this.valueAsString = transformedValue;
        }

        console.log(this.selectedLanguage, this.decimalLocaleSymbol, this.groupLocaleSymbol, this.minusLocaleSymbol, this.plusLocaleSymbol);
      })
    });
  }

  onBlur(event: FocusEvent) {
    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      let currentValue = target.value;

      let cleanValue = currentValue.split(this.groupLocaleSymbol).join('');
      cleanValue = cleanValue.split(this.decimalLocaleSymbol).join('.');
      cleanValue = cleanValue.split(this.minusLocaleSymbol).join('-');
      cleanValue = cleanValue.split(this.plusLocaleSymbol).join('+');

      this.valueAsNumber = +cleanValue;

      console.log(target.value, cleanValue);
      let transformedValue = this.decimalPipe.transform(this.valueAsNumber, '', this.selectedLanguage);
      if (transformedValue != null) {
        this.valueAsString = transformedValue;
      }
    }
  }
}
