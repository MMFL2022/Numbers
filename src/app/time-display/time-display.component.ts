import { Component } from '@angular/core';

@Component({
  selector: 'app-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss']
})
export class TimeDisplayComponent {

  value1: Date = new Date();

  private _value2: Date = new Date();
  public get value2(): Date {
    return this._value2;
  }
  public set value2(value: Date) {
    this._value2 = value;

    if (this.value3 <= value) {
      this.value3 = value;
    }
  }

  private _value3: Date = new Date();
  public get value3(): Date {
    return this._value3;
  }
  public set value3(value: Date) {
    this._value3 = value;
  }

}
