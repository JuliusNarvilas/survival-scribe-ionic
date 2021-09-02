import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { IntProperty, PropertyComponent, PropertyEditNumberComponent } from '../properties.app';

@Component({
  selector: 'app-property-int-edit',
  templateUrl: 'property.int.edit.html',
  styleUrls: ['../properties.shared.scss']
})
export class PropertyIntEditComponent extends PropertyEditNumberComponent implements AfterViewInit {
  numProperty: IntProperty;

  @Input()
  private displaySize = 2;

  @ViewChild('dataInput', {read: ElementRef})
  private inputElement: ElementRef;

  constructor(changeDetect: ChangeDetectorRef) {
    super(changeDetect);
  }

  getValue(): number {
    return this.numProperty ? this.numProperty.getValue() : 0;
  }

  setData(data: any) {
    if (data instanceof IntProperty)
    {
      this.numProperty = (data as IntProperty);
      this.valStr = this.numProperty.getValue().toString();
    } else {
      let dataClassName = '[unknown]';
      if (data.constructor)
      {
        dataClassName = data.constructor.name;
      }
      console.log('PropertyIntEditComponent::SetValue was given incompatible data ' + dataClassName);
    }
  }

  setDisplayWidth(digitCount: number) {
    this.displaySize = digitCount;
    if (this.inputElement && this.inputElement.nativeElement)
    {
      this.inputElement.nativeElement.size = this.displaySize;
    }
  }

  add(addVal: number) {
    this.numProperty.setBaseValue(this.numProperty.getBaseValue() + addVal);
    this.valStr = this.numProperty.getValue().toString();
  }

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.size = this.displaySize;
  }
}
