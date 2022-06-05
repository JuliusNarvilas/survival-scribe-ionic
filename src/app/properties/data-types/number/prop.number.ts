/* eslint-disable no-bitwise */

import { AnyProperty, EPropertyChangeType, PropertyChangeData, PropertyObserver } from '../../shared/prop.shared';


export abstract class NumberModifierBase {
  public readonly key: string;
  protected lastValue: number;

  constructor(key: string) {
    this.lastValue = 0;
    this.key = key;
  }

  getModification(): number { return this.lastValue; }
  getOrder(): number { return 100; }
}


export abstract class NumberModifier extends NumberModifierBase {

  constructor(key: string) {
    super(key);
  }

  abstract update(eventData: NumberPropertyChangeData): void;
}

export class ObserverChangeRecord{
  observer: PropertyObserver;
  modification: number;
  depletion: number;
}

export class NumberPropertyChangeData extends PropertyChangeData {
  public readonly oldModification: number;
  public readonly oldDepletion: number;
  public readonly oldObserverChanges: ObserverChangeRecord[];
  public readonly newObserverChanges: ObserverChangeRecord[];
  public readonly context: any;

  constructor(
    property: NumberProperty,
    changeType: number|EPropertyChangeType,
    oldMod: number,
    oldDep: number,
    oldObserverChanges: ObserverChangeRecord[],
    context: any)
  {
    super(property, changeType, context);

    this.oldModification = oldMod;
    this.oldDepletion = oldDep;
    this.oldObserverChanges = oldObserverChanges;
    this.newObserverChanges = [];
    this.context = context;
  }
}


/**
 * Property class to represent a numerical value
 *
 */
export class NumberProperty extends AnyProperty {
  protected value: number;
  protected baseValue: number;
  protected finalModifier: number;
  protected updating: boolean;
  protected observerChanges: ObserverChangeRecord[];

  constructor(value: number) {
    super();
    this.value = value;
    this.baseValue = value;
    this.finalModifier = 0;
    this.updating = false;
    this.observerChanges = [];
  }


  public getValue(): number {
    return this.value;
  }

  public getBaseValue(): number {
    return this.baseValue;
  }

  public setBaseValue(value: number, context?: any): void {
    if (!context) {
      context = this.owner.getContext();
    }
    this.baseValue = value;
    this.updateInternal(EPropertyChangeType.baseSet, context);
  }

  public getValuePositive(): number {
    return this.value > 0 ? this.value : 0;
  }

  /*
  public addModifier(modifier: NumberModifier, context: TContext): void {
    if (!modifier) {
      return;
    }
    this.modifiers.push(modifier);
    (this.modifiers as NumberModifierBase[]).sort(NumberProperty.modifierSortCompare);
    this.updateInternal(EPropertyChangeType.modifierAdd, context);
  }

  public removeModifier(modifier: string | NumberModifier, context: TContext): void {
    if (!modifier) {
      return;
    }
    let index = -1;
    if (typeof modifier === 'string') {
      const modCount = this.modifiers.length;
      for (let i = 0; i < modCount; i++) {
        const modItem = this.modifiers[i];
        if (modItem.key === modifier) {
          index = i;
          break;
        }
      }
    } else {
      index = this.modifiers.indexOf(modifier);
    }

    if (index > -1) {
      this.modifiers.splice(index, 1);
      (this.modifiers as NumberModifierBase[]).sort(NumberProperty.modifierSortCompare);
      this.updateInternal(EPropertyChangeType.modifierRemove, context);
    }
  }
*/

  public update(changeType?: EPropertyChangeType, context?: any) {
    const changeTypeMask = changeType !== undefined ? changeType | EPropertyChangeType.forceUpdate : EPropertyChangeType.forceUpdate;

    if (!context) {
      context = this.owner.getContext();
    }
    this.updateInternal(changeTypeMask, context);
  }

  public getValueAsString(): string {
    return this.value.toString();
  }

  protected updateInternal(changeType: number, context: any): void {
    if (this.modifiers.length > 0) {
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
        }
    } else {
      this.updateModifiedValue();
    }
  }

  protected updateModifiers(eventData: NumberPropertyChangeData): void {
      const size = this.modifiers.length;
      for (let i = 0; i < size; ++i) {
        this.modifiers[i].update(eventData);
      }
      this.finalModifier = eventData.newModification;
  }

  protected updateModifiedValue(): void {
      this.value = this.baseValue + this.finalModifier;
  }
}

export class NumberReserveProperty extends NumberProperty {
  protected depletion: number;

  constructor(value: number) {
    super(value);
  }

  getDepletion(): number {
    return this.depletion;
  }

  getMax(): number {
    return this.baseValue + this.finalModifier;
  }

  deplete(value: number, context?: any): void {
    if (typeof context === 'undefined') {
      context = this.owner.getContext();
    }
    this.depletion += value;
    this.updateInternal(EPropertyChangeType.deplete, context);
  }

  restore(value: number, context?: any): void {
    this.deplete(-value, context);
  }

  protected updateInternal(changeType: number, context?: any): void {
    if ((this.modifiers.length > 0)) {
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
      this.updateExhaustableModifiedValue();

      if ((changeType & EPropertyChangeType.nestedUpdate) === EPropertyChangeType.none) {
          this.updating = false;
      }
    } else {
        this.updateExhaustableModifiedValue();
    }
  }

  protected updateExhaustableModifiedValue(): void {
    // clamp depletion to be in range [0, |getMax()|]
    const maxValue = this.getMax();
    if (this.depletion > maxValue) {
      this.depletion = maxValue;
    }
    if (this.depletion < 0) {
      this.depletion = 0;
    }

    this.value = maxValue - this.depletion;
  }
}

