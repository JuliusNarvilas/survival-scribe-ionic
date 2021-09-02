

// import { Survivor } from '../models/survivor';
import { Survivor } from 'src/app/characters/Survivor';
import {
  ObservableNumericalProperty,
  ObservableExhaustibleNumericalProperty } from './shared/properties.shared.number.observable';
import { NumericalPropertyChangeData, NumericalModifier } from './shared/properties.shared.number';
import { Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AppStateContext } from '../models/models.shared';
import { PropertyModifierDefinition } from '../models/models.definitions';
import {Interpreter as JSInterpreter} from 'js-interpreter';
import { ScriptExec } from '../libs/scriptExec/scriptExec';
import { EnumProperty } from './shared/properties.shared.enum';
import { EPropertyCompType, AnyProperty } from './shared/properties.shared';




export class IntProperty extends ObservableNumericalProperty<AppStateContext> {
  constructor(value = 0) {
    super(value);
    this.typeMetadata = EPropertyCompType.Int;
  }
}

export class IntExhaustibleProperty extends ObservableExhaustibleNumericalProperty<AppStateContext> {
  constructor(value = 0) {
    super(value);
    this.typeMetadata = EPropertyCompType.IntExhaustible;
  }
}

export class IntCollectionProperty extends AnyProperty {
  items: IntProperty[] = [];

  constructor() {
    super();
    this.typeMetadata = EPropertyCompType.IntCollection;
  }

  getValueAsString(): string {
    let itemsStr = '';
    for (const item of this.items) {
      if (itemsStr.length > 0) {
        itemsStr += ', ';
      }
      itemsStr += item.getValue();
    }
    return '[ ' + itemsStr + ' ]';
  }
}


export class IntExhaustibleCollectionProperty extends AnyProperty {
  items: IntExhaustibleProperty[] = [];

  constructor() {
    super();
    this.typeMetadata = EPropertyCompType.IntExhaustibleCollection;
  }

  getValueAsString(): string {
    let itemsStr = '';
    for (const item of this.items) {
      if (itemsStr.length > 0) {
        itemsStr += ', ';
      }
      itemsStr += item.getValue() + '/' + item.getBaseValue();
    }
    return '[ ' + itemsStr + ' ]';
  }
}


export class FloatProperty extends ObservableNumericalProperty<AppStateContext> {
  constructor(value = 0) {
    super(value);
    this.typeMetadata = EPropertyCompType.Float;
  }
}

export class FloatExhaustibleProperty extends ObservableExhaustibleNumericalProperty<AppStateContext> {
  constructor(value = 0) {
    super(value);
    this.typeMetadata = EPropertyCompType.FloatExhaustible;
  }
}

export class FloatCollectionProperty extends AnyProperty {
  items: FloatProperty[] = [];

  constructor() {
    super();
    this.typeMetadata = EPropertyCompType.FloatCollection;
  }

  getValueAsString(): string {
    let itemsStr = '';
    for (const item of this.items) {
      if (itemsStr.length > 0) {
        itemsStr += ', ';
      }
      itemsStr += item.getValue();
    }
    return '[ ' + itemsStr + ' ]';
  }
}


export class FloatExhaustibleCollectionProperty extends AnyProperty {
  items: FloatExhaustibleProperty[] = [];

  constructor() {
    super();
    this.typeMetadata = EPropertyCompType.FloatExhaustibleCollection;
  }

  getValueAsString(): string {
    let itemsStr = '';
    for (const item of this.items) {
      if (itemsStr.length > 0) {
        itemsStr += ', ';
      }
      itemsStr += item.getValue() + '/' + item.getBaseValue();
    }
    return '[ ' + itemsStr + ' ]';
  }
}


export abstract class PropertyComponent {
  @Input()
  label = '';

  abstract setData(data: any): void;
}


export abstract class PropertyEditNumberComponent extends PropertyComponent {
  changeDetector: ChangeDetectorRef;
  valStr = '0';

  constructor(changeDetect: ChangeDetectorRef) {
    super();
    this.changeDetector = changeDetect;
  }

  abstract getValue(): number;
  abstract add(addVal: number): void;

  onFieldChange(event: any) {
    let newNumVal = 0;
    const newValStr = event.detail.value as string;
    if (this.getValue().toString() !== newValStr) {
      newNumVal = parseInt(newValStr, undefined);
      if (isNaN(newNumVal)) {
        newNumVal = 0;
      }
    } else {
      // value string is unchanged
      return;
    }

    // NgZone.assertInAngularZone();

    const valDiff = newNumVal - this.getValue();
    if (valDiff !== 0) {
      this.add(valDiff);
    } else {
      this.valStr = newNumVal.toString();
      // input field sometimes doesn't auto update properly
      this.changeDetector.detectChanges();
    }
  }

  onKeyPressBlurCheck(event: any) {
    const navigationKeys = [
      'Tab',
      'Escape',
      'Enter',
      'Home'
    ];

    if (navigationKeys.includes(event.key)) {
      // this.inputElement.nativeElement.blur();
      (document.activeElement as HTMLInputElement).blur();
    }
  }
}

