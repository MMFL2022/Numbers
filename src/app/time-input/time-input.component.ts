import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit {
  @Input() restorePreviousValue: boolean = true;
  @Input() precision: number | undefined;
  @Input() minValue: number | undefined;
  @Input() maxValue: number | undefined;
  @Input() hourCycle: boolean | undefined;

  selectedLanguage: string = 'en-US';

  @Input() valueAsNumber: number = 0;
  @Output() valueAsNumberChange: EventEmitter<number> = new EventEmitter<number>;

  valueAsString: string = '16:00';

  previousValueAsNumber: number = 0;

  tempValue: string = '';
  tempValueAsDate: Date | undefined | null;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;

        if (this.hourCycle == undefined) {
          let locale = new Intl.DateTimeFormat(this.selectedLanguage, {hour: 'numeric'}).resolvedOptions();
          // let hourCycles = locale.hourCycles;
          console.log('hourCycle', locale)
          // this.hourCycle = hourCycle;
        }
      })
    });
  }

  onFocus(event: FocusEvent) {
    console.log('onFocus', event);
    if (this.restorePreviousValue) {
      this.previousValueAsNumber = this.valueAsNumber;
      this.valueAsString = '';
    }
  }

  onBlur(event: FocusEvent) {
    console.log('onBlur', event);

    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      let currentValue = target.value;

      this.tempValue = currentValue;
      this.tempValueAsDate = target.valueAsDate;
    }
  }

  onKeypress(event: KeyboardEvent) {
    console.log('onKeypress', event);
  }
}
