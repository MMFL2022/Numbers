import { DecimalPipe, NumberSymbol, getLocaleNumberSymbol } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  @Input() restorePreviousValue: boolean = true;
  @Input() precision: number | undefined;
  @Input() minValue: number | undefined;
  @Input() maxValue: number | undefined;

  private selectedLanguage: string = 'en-US';

  private _valueAsNumber: number = 0;
  public get valueAsNumber(): number {
    return this._valueAsNumber;
  }
  @Input() public set valueAsNumber(value: number) {
    this._valueAsNumber = value;
    this.localize();
  }
  @Output() valueAsNumberChange: EventEmitter<number> = new EventEmitter<number>();

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

  inputMode: string = 'decimal';

  constructor(
    private translateService: TranslateService,
    private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    if (this.precision != undefined && this.precision == 0) {
        this.inputMode = 'numeric';
    }

    this.selectedLanguage = this.translateService.currentLang;

    this.updateLocale();

    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;

        this.updateLocale();
      })
    });
  }

  updateLocale() {
    this.groupLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Group);
    this.decimalLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.Decimal);
    this.minusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.MinusSign);
    this.plusLocaleSymbol = getLocaleNumberSymbol(this.selectedLanguage, NumberSymbol.PlusSign);

    this.groupLocaleRegEx = new RegExp(`[${this.groupLocaleSymbol}]`, 'g');
    this.decimalLocaleRegEx = new RegExp(`[${this.decimalLocaleSymbol}]`, 'g');
    this.minusLocaleRegEx = new RegExp(`[${this.minusLocaleSymbol}]`, 'g');
    this.plusLocaleRegEx = new RegExp(`[${this.plusLocaleSymbol}]`, 'g');

    this.allowedCharacters = new RegExp(`[0-9\\${this.groupLocaleSymbol}\\${this.decimalLocaleSymbol}\\${this.minusLocaleSymbol}\\${this.plusLocaleSymbol}]+`);

    this.validate();
    this.localize();
  }

  onFocus(event: FocusEvent) {
    if (this.restorePreviousValue) {
      this.previousValueAsNumber = this._valueAsNumber;
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
          this._valueAsNumber = this.previousValueAsNumber;
        } else {
          this._valueAsNumber = 0;
        }
      } else {
        this._valueAsNumber = parsedNumber;
      }

      this.validate();
      this.localize();

      this.valueAsNumberChange.emit(this._valueAsNumber);
    }
  }

  onKeypress(event: KeyboardEvent) {
    let value = event.key;

    if (!this.allowedCharacters.test(value)) {
      event.preventDefault();
    }
  }

  private validate() {
    if (this.precision != undefined) {
      this._valueAsNumber = parseFloat(this._valueAsNumber.toFixed(this.precision));
    }

    if (this.minValue != undefined) {
      if (this._valueAsNumber < this.minValue) {
        this._valueAsNumber = this.minValue;
      }
    }

    if (this.maxValue != undefined) {
      if (this._valueAsNumber > this.maxValue) {
        this._valueAsNumber = this.maxValue;
      }
    }
  }

  private localize() {
    let transformedValue = this.decimalPipe.transform(this._valueAsNumber, '', this.selectedLanguage);
    if (transformedValue != null) {
      this.valueAsString = transformedValue;
    }
  }
}
