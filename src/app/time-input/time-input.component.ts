import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit {
  @Input() restorePreviousValue: boolean = false;

  // private selectedLanguage: string = 'en-US';

  @Input() valueAsDate: Date = new Date();
  @Output() valueAsDateChange: EventEmitter<Date> = new EventEmitter<Date>;

  valueAsString: string = '00:00';

  previousValueAsDate: Date = new Date();

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: ((value: LangChangeEvent) => {
        // this.selectedLanguage = value.lang;

        // if (this.hourCycle == undefined) {
        //   let locale = new Intl.DateTimeFormat(this.selectedLanguage, {hour: 'numeric'}).resolvedOptions();
        //   // let hourCycles = locale.hourCycles;
        //   console.log('hourCycle', locale)
        //   // this.hourCycle = hourCycle;
        // }

        if (this.restorePreviousValue) {
          this.previousValueAsDate = this.valueAsDate;
        }

        this.localize();
      })
    });
  }

  onFocus(event: FocusEvent) {
    if (this.restorePreviousValue) {
      this.previousValueAsDate = this.valueAsDate;
      this.valueAsString = '';
    }
  }

  onBlur(event: FocusEvent) {
    if (event.target != null) {
      let target = event.target as HTMLInputElement;

      let currentValue = target.value;

      if (currentValue == '') {
        if (this.restorePreviousValue) {
          this.valueAsDate = this.previousValueAsDate;
        }
      } else {
        let timeParts = currentValue.split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);

        this.valueAsDate.setHours(hours);
        this.valueAsDate.setMinutes(minutes);
        this.valueAsDate.setSeconds(0);
        this.valueAsDate.setMilliseconds(0);

        // Date object is mutable so changing the hours, minutes and seconds properties won't
        // change the underlying value so reinstantiate the original date object with the new changes
        this.valueAsDate = new Date(this.valueAsDate);
      }

      this.localize();

      this.valueAsDateChange.emit(this.valueAsDate);
    }
  }

  private localize() {
    if (this.valueAsDate != null) {
      let transformedHours = this.padNumber(this.valueAsDate.getHours());
      let transformedMinutes = this.padNumber(this.valueAsDate.getMinutes());

      this.valueAsString = `${transformedHours}:${transformedMinutes}`;
    }
  }

  private padNumber(number: number): string {
    if (number > 10) {
      return number.toString();
    }

    return `0${number}`;
  }
}
