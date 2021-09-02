
// tslint:disable : no-bitwise

import { AnyProperty } from './properties.shared';

export enum ENumericalPropertyChangeType {
  /**
   * Empty mask.
   */
  None = 0,
  /**
   * Flag for a new modifier being added.
   */
  ModifierAdd = 1 << 0,
  /**
   * Flag for a modifier being removed.
   */
  ModifierRemove = 1 << 1,
  /**
   * Flag for setting the base value.
   */
  BaseSet = 1 << 2,
  /**
   * Flag for depleating or restoring the max value.
   */
  Deplete = 1 << 3,
  /**
   * Flag for indicating that changes were made through a bundled change submission.
   */
  Bundle = 1 << 4,
  /**
   * Flag for indicating that an explicit update request was made.
   */
  ForceUpdate = 1 << 5,
  /**
   * Flag for indicating that property changes for this update process were made inside another update process.
   *
   * It's recommended to always check and avoid nested updates unless required.
   * Unintended nested updates can result to an infinite recursion and a stack overflow.
   */
  NestedUpdate = 1 << 6,

  /**
   * Mask containing flags for any type of modifier change.
   */
  ModifierChange = ModifierAdd | ModifierRemove
}


export class NumericalPropertyChangeData<TContext> {
  public readonly property: NumericalProperty<TContext>;
  public readonly changeTypeMask: number;
  public readonly oldModification: number;
  public readonly oldDepletion: number;
  public readonly context: TContext;

  public newModification: number;
  public newDepletion: number;

  constructor(
    property: NumericalProperty<TContext>,
    changeType: number|ENumericalPropertyChangeType,
    oldMod: number,
    oldDep: number,
    context: TContext) {

    this.property = property;
    this.changeTypeMask = changeType;
    this.oldModification = oldMod;
    this.oldDepletion = oldDep;
    this.context = context;

    this.newModification = 0;
    this.newDepletion = oldDep;
  }
}


export abstract class NumericalModifierBase {
  protected lastValue: number;
  public readonly key: string;

  constructor(key: string) {
    this.lastValue = 0;
    this.key = key;
  }

  getModification(): number { return this.lastValue; }
  getOrder(): number { return 100; }
}


export abstract class NumericalModifier<TContext> extends NumericalModifierBase {

  constructor(key: string) {
    super(key);
  }

  abstract update(eventData: NumericalPropertyChangeData<TContext>): void;
}



/**
 * Property class to represent a numerical value
 * @template TContext Change context type
 */
export class NumericalProperty<TContext> extends AnyProperty {
  protected value: number;
  protected baseValue: number;
  protected finalModifier: number;
  protected updating: boolean;
  protected modifiers: NumericalModifier<TContext>[];

  protected userData: any;

  private static modifierSortCompare(arg1: NumericalModifierBase, arg2: NumericalModifierBase): number {
    const arg1Order = arg1.getOrder();
    const arg2Order = arg2.getOrder();
    if (arg1Order === arg2Order) {
      return 0;
    }
    return arg1Order < arg2Order ? -1 : 1;
  }

  constructor(value: number) {
    super();
    this.value = value;
    this.baseValue = value;
    this.finalModifier = 0;
    this.updating = false;
    this.modifiers = [];
  }

  public getValue(): number {
    return this.value;
  }

  public getBaseValue(): number {
    return this.baseValue;
  }

  public setBaseValue(value: number, context?: TContext): void {
    if (!context) {
      context = this.makeContext();
    }
    this.baseValue = value;
    this.updateInternal(ENumericalPropertyChangeType.BaseSet, context);
  }

  public getValuePositive(): number {
    return this.value > 0 ? this.value : 0;
  }

  public addModifier(modifier: NumericalModifier<TContext>, context: TContext): void {
    if (!modifier) {
      return;
    }
    this.modifiers.push(modifier);
    (this.modifiers as NumericalModifierBase[]).sort(NumericalProperty.modifierSortCompare);
    this.updateInternal(ENumericalPropertyChangeType.ModifierAdd, context);
  }

  public removeModifier(modifier: string | NumericalModifier<TContext>, context: TContext): void {
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
      (this.modifiers as NumericalModifierBase[]).sort(NumericalProperty.modifierSortCompare);
      this.updateInternal(ENumericalPropertyChangeType.ModifierRemove, context);
    }
  }

  public update(changeType?: ENumericalPropertyChangeType, context?: TContext) {
    let changeTypeMask = ENumericalPropertyChangeType.ForceUpdate;
    if (changeType !== undefined) {
      changeTypeMask = changeType | ENumericalPropertyChangeType.ForceUpdate;
    }
    if (!context) {
      context = this.makeContext();
    }
    this.updateInternal(changeTypeMask, context);
  }

  public getValueAsString(): string {
    return this.value.toString();
  }


  protected makeContext(): TContext {
    return {} as TContext;
  }

  protected updateInternal(changeType: number, context: TContext): void {
    if (this.modifiers.length > 0) {
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
        }
    } else {
      this.updateModifiedValue();
    }
  }

  protected updateModifiers(eventData: NumericalPropertyChangeData<TContext>): void {
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

export class ExhaustibleNumericalProperty<TContext> extends NumericalProperty<TContext> {
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

  deplete(value: number, context?: TContext): void {
    if (typeof context === 'undefined') {
      context = this.makeContext();
    }
    this.depletion += value;
    this.updateInternal(ENumericalPropertyChangeType.Deplete, context);
  }

  restore(value: number, context?: TContext): void {
    this.deplete(-value, context);
  }

  protected updateInternal(changeType: number, context?: TContext): void {
    if ((this.modifiers.length > 0)) {
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
      this.updateExhaustableModifiedValue();

      if ((changeType & ENumericalPropertyChangeType.NestedUpdate) === ENumericalPropertyChangeType.None) {
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

