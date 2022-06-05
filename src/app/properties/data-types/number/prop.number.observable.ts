/* eslint-disable no-bitwise */

import { EPropertyChangeType, PropertyChangeData, PropertyObserver } from '../../shared/prop.shared';
import {
  NumberReserveProperty,
  NumberProperty,
  NumberPropertyChangeData } from './prop.number';



export class ObservableNumberProperty extends NumberProperty {
  private observers: PropertyObserver[] = [];

  constructor(value: number) {
    super(value);
  }

  public attachObserver(observer: NumberPropertyObserver): void {
    if (observer) {
      this.observers.push(observer);
    }
  }

  public detachObserver(observer: NumberPropertyObserver): void {
    const matchIndex = this.observers.indexOf(observer);
    if (matchIndex > -1) {
      this.observers.splice(matchIndex, 1);
    }
  }

  protected triggerObservers(eventData: NumberPropertyChangeData): void {
    for (const observer of this.observers) {
      observer.update(eventData);
    }
  }

  protected updateInternal(changeType: EPropertyChangeType, context: any): void {
    if ((this.modifiers.length > 0) || (this.observers.length > 0)) {
      // tracking of nested update types
      if (!this.updating) {
          this.updating = true;
      } else {
        changeType = changeType | EPropertyChangeType.nestedUpdate;
      }

      const eventData = new NumberPropertyChangeData(
            this,
            changeType,
            this.finalModifier,
            0,
            context
        );

      this.updateModifiers(eventData);
      this.updateModifiedValue();

      // leaving the scope of nested updating
      if ((changeType & EPropertyChangeType.nestedUpdate) === EPropertyChangeType.none) {
          this.updating = false;
          this.triggerObservers(eventData);
      }
    } else {
      this.updateModifiedValue();
    }
  }

}

export class ObservableNumberReserveProperty extends NumberReserveProperty {
  private observers: NumberPropertyObserver[] = [];

  constructor(value: number) {
    super(value);
  }

  public attachObserver(observer: NumberPropertyObserver): void {
    if (observer) {
      this.observers.push(observer);
    }
  }

  public detachObserver(observer: NumberPropertyObserver): void {
    const matchIndex = this.observers.indexOf(observer);
    if (matchIndex > -1) {
      this.observers.splice(matchIndex, 1);
    }
  }

  protected triggerObservers(eventData: NumberPropertyChangeData): void {
    for (const observer of this.observers) {
      observer.update(eventData);
    }
  }

  protected updateInternal(changeType: EPropertyChangeType, context: any): void {
    if ((this.modifiers.length > 0) || (this.observers.length > 0)) {
      // tracking of nested update types
      if (!this.updating) {
          this.updating = true;
      } else {
        changeType = changeType | EPropertyChangeType.nestedUpdate;
      }

      const maxValue = this.getMax();
      const eventData = new NumberPropertyChangeData(
        this,
        changeType,
        this.finalModifier,
        maxValue - this.value,
        context
      );
      eventData.newDepletion = this.depletion;

      this.updateModifiers(eventData);
      this.depletion = eventData.newDepletion;
      this.updateModifiedValue();

      // leaving the scope of nested updating
      if ((changeType & EPropertyChangeType.nestedUpdate) === EPropertyChangeType.none) {
          this.updating = false;
          this.triggerObservers(eventData);
      }
    } else {
      this.updateModifiedValue();
    }
  }

}



