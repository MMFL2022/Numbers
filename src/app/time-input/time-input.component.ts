import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit {
  @Input() restorePreviousValue: boolean = true;
  @Input() minValue: number | undefined;
  @Input() maxValue: number | undefined;

  selectedLanguage: string = 'en-US';

  private defaultDate = new Date(1900, 0, 1, 0, 0, 0, 0);

  @Input() valueAsDate: Date = this.defaultDate;
  @Output() valueAsDateChange: EventEmitter<Date> = new EventEmitter<Date>;

  valueAsString: string = '00:00';

  previousValueAsDate: Date = this.defaultDate;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        this.selectedLanguage = value.lang;

        // if (this.hourCycle == undefined) {
        //   let locale = new Intl.DateTimeFormat(this.selectedLanguage, {hour: 'numeric'}).resolvedOptions();
        //   // let hourCycles = locale.hourCycles;
        //   console.log('hourCycle', locale)
        //   // this.hourCycle = hourCycle;
        // }

        this.previousValueAsDate = this.valueAsDate;

        this.validate();
        this.localize();
      })
    });
  }

  onFocus(event: FocusEvent) {
    console.log('onFocus', event);
    if (this.restorePreviousValue) {
      this.previousValueAsDate = this.valueAsDate;
      this.valueAsString = '';
    }
  }

  onBlur(event: FocusEvent) {
    console.log('onBlur', event);

    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      let currentValue = target.value;
      let currentValueAsDate = target.valueAsDate;

      console.log('onBlur current values', currentValue, currentValueAsDate);

      if (currentValueAsDate == null) {
        if (this.restorePreviousValue) {
          this.valueAsDate = this.previousValueAsDate;
        } else {
          this.valueAsDate = this.defaultDate;
        }
      } else {
        let selectedDateTime = this.defaultDate;

        let timeParts = currentValue.split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);

        selectedDateTime.setHours(hours);
        selectedDateTime.setMinutes(minutes);

        this.valueAsDate = selectedDateTime;
      }

      this.validate();
      this.localize();

      console.log('emitting valueAsDate', this.valueAsDate, currentValueAsDate);

      this.valueAsDateChange.emit(this.valueAsDate);
    }
  }

  private validate() {
    // add validation logic

    let selectedTime = this.getSelectedTime();

    if (selectedTime != null) {
      this.valueAsDate = selectedTime;
    }
    // else {
    //   this.valueAsDate = this.defaultDate;
    // }
  }

  private localize() {
    let transformedValue = this.getSelectedTime();

    if (transformedValue != null) {
      let transformedHours = this.padNumber(transformedValue.getHours());
      let transformedMinutes = this.padNumber(transformedValue.getMinutes());
      this.valueAsString = `${transformedHours}:${transformedMinutes}`;
    }
  }

  private getSelectedTime(): Date | null {
    let year = this.defaultDate.getFullYear();
    let month = this.defaultDate.getMonth();
    let day = this.defaultDate.getDate();

    let hours = this.valueAsDate.getHours();
    let minutes = this.valueAsDate.getMinutes();
    let seconds = this.valueAsDate.getSeconds();
    let milliseconds = this.valueAsDate.getMilliseconds();

    console.log(this.valueAsDate.getTime());

    let transformedValue = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);

    console.log('transformedValue', transformedValue);

    if (transformedValue == null) {
      return null;
    }

    return transformedValue;
  }

  private padNumber(number: number): string {
    if (number > 10) {
      return number.toString();
    }

    return `0${number}`;
  }
}
