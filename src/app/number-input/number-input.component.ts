import { DecimalPipe, NumberFormatStyle, NumberSymbol, getLocaleNumberFormat, getLocaleNumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  @Input() restorePreviousValue: boolean = true;
  @Input() precision: number | undefined;

  selectedLanguage: string = 'en-US';

  valueAsNumber: number = -12345.54321;
  valueAsString: string = '';

  previousValueAsNumber: number = 0;

  groupLocaleSymbol: string = '';
  groupLocaleRegEx: RegExp = new RegExp('');
  decimalLocaleSymbol: string = '';
  decimalLocaleRegEx: RegExp = new RegExp('');
  minusLocaleSymbol: string = '';
  minusLocaleRegEx: RegExp = new RegExp('');
  plusLocaleSymbol: string = '';
  plusLocaleRegEx: RegExp = new RegExp('');

  allowedCharacters: RegExp = new RegExp('');

  constructor(
    private translateService: TranslateService,
    private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;

        this.groupLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Group);
        this.decimalLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Decimal);
        this.minusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.MinusSign);
        this.plusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.PlusSign);

        this.groupLocaleRegEx = new RegExp(`[${this.groupLocaleSymbol}]`, 'g');
        this.decimalLocaleRegEx = new RegExp(`[${this.decimalLocaleSymbol}]`, 'g');
        this.minusLocaleRegEx = new RegExp(`[${this.minusLocaleSymbol}]`, 'g');
        this.plusLocaleRegEx = new RegExp(`[${this.plusLocaleSymbol}]`, 'g');

        this.allowedCharacters = new RegExp(`[0-9\\${this.groupLocaleSymbol}\\${this.decimalLocaleSymbol}\\${this.minusLocaleSymbol}\\${this.plusLocaleSymbol}]+`);

        this.localizeNumber();
      })
    });
  }

  onFocus(event: FocusEvent) {
    if (this.restorePreviousValue) {
      this.previousValueAsNumber = this.valueAsNumber;
      this.valueAsString = '';
    }
  }

  onBlur(event: FocusEvent) {
    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      let currentValue = target.value;

      let cleanValue = '';
      if (currentValue != '') {
        cleanValue = currentValue.replace(this.groupLocaleRegEx, '');
        cleanValue = cleanValue.replace(this.decimalLocaleRegEx, '.');
        cleanValue = cleanValue.replace(this.minusLocaleRegEx, '-');
        cleanValue = cleanValue.replace(this.plusLocaleRegEx, '+');
      }

      let parsedNumber = parseFloat(cleanValue);

      if (cleanValue == '' || isNaN(parsedNumber)) {
        if (this.restorePreviousValue) {
          this.valueAsNumber = this.previousValueAsNumber;
        } else {
          this.valueAsNumber = 0;
        }
      } else {
        this.valueAsNumber = parsedNumber;
      }

      this.localizeNumber();
    }
  }

  onKeypress(event: KeyboardEvent) {
    let value = event.key;

    if (!this.allowedCharacters.test(value)) {
      event.preventDefault();
    }
  }

  private localizeNumber() {
    if (this.precision != undefined) {
      this.valueAsNumber = parseFloat(this.valueAsNumber.toFixed(this.precision));
    }

    let transformedValue = this.decimalPipe.transform(this.valueAsNumber, '', this.selectedLanguage);
    if (transformedValue != null) {
      this.valueAsString = transformedValue;
    }
  }
}
