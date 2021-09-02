
import {
  ExhaustibleNumericalProperty,
  NumericalProperty,
  NumericalPropertyChangeData,
  ENumericalPropertyChangeType } from './properties.shared.number';

// tslint:disable : no-bitwise

interface NumericalPropertyObserver<TContext> {
  update(eventData: NumericalPropertyChangeData<TContext>): void;
}

export class ObservableNumericalProperty<TContext> extends NumericalProperty<TContext> {
  private observers: NumericalPropertyObserver<TContext>[] = [];

  constructor(value: number) {
    super(value);
  }

  public attachObserver(observer: NumericalPropertyObserver<TContext>): void {
    if (observer) {
      this.observers.push(observer);
    }
  }

  public detachObserver(observer: NumericalPropertyObserver<TContext>): void {
    const matchIndex = this.observers.indexOf(observer);
    if (matchIndex > -1) {
      this.observers.splice(matchIndex, 1);
    }
  }

  protected triggerObservers(eventData: NumericalPropertyChangeData<TContext>): void {
    for (const observer of this.observers) {
      observer.update(eventData);
    }
  }

  protected updateInternal(changeType: ENumericalPropertyChangeType, context: TContext): void {
    if ((this.modifiers.length > 0) || (this.observers.length > 0)) {
      // tracking of nested update types
      if (!this.updating) {
          this.updating = true;
      } else {
        changeType = changeType | ENumericalPropertyChangeType.NestedUpdate;
      }

      const eventData = new NumericalPropertyChangeData<TContext>(
            this,
            changeType,
            this.finalModifier,
            0,
            context
        );

      this.updateModifiers(eventData);
      this.updateModifiedValue();

      // leaving the scope of nested updating
      if ((changeType & ENumericalPropertyChangeType.NestedUpdate) === ENumericalPropertyChangeType.None) {
          this.updating = false;
          this.triggerObservers(eventData);
      }
    } else {
      this.updateModifiedValue();
    }
  }

}

export class ObservableExhaustibleNumericalProperty<TContext> extends ExhaustibleNumericalProperty<TContext> {
  private observers: NumericalPropertyObserver<TContext>[] = [];

  constructor(value: number) {
    super(value);
  }

  public attachObserver(observer: NumericalPropertyObserver<TContext>): void {
    if (observer) {
      this.observers.push(observer);
    }
  }

  public detachObserver(observer: NumericalPropertyObserver<TContext>): void {
    const matchIndex = this.observers.indexOf(observer);
    if (matchIndex > -1) {
      this.observers.splice(matchIndex, 1);
    }
  }

  protected triggerObservers(eventData: NumericalPropertyChangeData<TContext>): void {
    for (const observer of this.observers) {
      observer.update(eventData);
    }
  }

  protected updateInternal(changeType: ENumericalPropertyChangeType, context: TContext): void {
    if ((this.modifiers.length > 0) || (this.observers.length > 0)) {
      // tracking of nested update types
      if (!this.updating) {
          this.updating = true;
      } else {
        changeType = changeType | ENumericalPropertyChangeType.NestedUpdate;
      }

      const maxValue = this.getMax();
      const eventData = new NumericalPropertyChangeData<TContext>(
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
      if ((changeType & ENumericalPropertyChangeType.NestedUpdate) === ENumericalPropertyChangeType.None) {
          this.updating = false;
          this.triggerObservers(eventData);
      }
    } else {
      this.updateModifiedValue();
    }
  }

}



