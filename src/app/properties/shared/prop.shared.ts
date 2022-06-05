/* eslint-disable no-bitwise */

export enum EPropertyCompType {
    unknown     = 1 << 0,
    collection  = 1 << 1,
    bool        = 1 << 2,
    int         = 1 << 3,
    intRanged   = 1 << 4,
    intReserve  = 1 << 5,
    float       = 1 << 6,
    floatRanged = 1 << 7,
    floatReserve = 1 << 8,
    enum        = 1 << 9,
    text        = 1 << 10,
    entity      = 1 << 11
}

export enum EPropertyChangeType {
  /**
   * Empty mask.
   */
  none = 0,
  /**
   * Flag for a new modifier being added.
   */
  modifierAdd = 1 << 0,
  /**
   * Flag for a modifier being removed.
   */
  modifierRemove = 1 << 1,
  /**
   * Flag for setting the base value.
   */
  baseSet = 1 << 2,
  /**
   * Flag for depleating or restoring the max value.
   */
  deplete = 1 << 3,
  /**
   * Flag for indicating that changes were made through a bundled change submission.
   */
  bundle = 1 << 4,
  /**
   * Flag for indicating that an explicit update request was made.
   */
  forceUpdate = 1 << 5,
  /**
   * Flag for indicating that property changes for this update process were made inside another update process.
   *
   * It's recommended to always check and avoid nested updates unless required.
   * Unintended nested updates can result to an infinite recursion and a stack overflow.
   */
  nestedUpdate = 1 << 6,

  /**
   * Mask containing flags for any type of modifier change.
   */
  modifierChange = modifierAdd | modifierRemove
}


export class PropertyInfo {
  /**
   * Unique key for identifying this property definition data
   */
  key = '';
  //labels should be retrieved with the key all the time
  //label = '';
  //description = '';

  order = 100;
  /**
   * A way of describing how relevant this data is for views.
   * Smaller numbers indicate more importance and this information
   * will appier even in brief entity summory views.
   * Importance levels are:
   * 1 - mostly the name for maybe printing out logs
   * 5 - important stats for spreadsheet displays
   * 10 - complete list of data
   */
  viewImportance = 10;

  componentType = 0;

  defaultVal = '';

  // things like allowed number value range
  metadata = '';

  groupKey = '';
}


export class PropertyModifierData {
    key = '';
    description = '';
    tags: string[] = [];

    updateCode = '';
    observerCode = '';
    observerFilters: string[] = [];
    // code callback for replacing placeholder markers in localization
    // with custom values
    placeholderMapCode = '';
}




/*
export class EPropertyCompTypeString {
    private static readonly enumMapping = {
        int: EPropertyCompType.int,
        intReserve: EPropertyCompType.intReserve,
        intRanged: EPropertyCompType.intRanged,
        float: EPropertyCompType.float,
        floatRanged: EPropertyCompType.floatRanged,
        floatReserve: EPropertyCompType.floatReserve,
        enum: EPropertyCompType.enum,
        enumCollection: EPropertyCompType.EnumCollection,
        String: EPropertyCompType.String,
        StringCollection: EPropertyCompType.StringCollection,
        Bool: EPropertyCompType.Bool,
        BoolCollection: EPropertyCompType.BoolCollection
    };
    public static getEnum(enumString: string): EPropertyCompType {
        const result = EPropertyCompTypeString.enumMapping[enumString];
        if (result === undefined) {
            return EPropertyCompType.unknown;
        }
        return result;
    }

    public static getStr(val: EPropertyCompType): string {
        for (const mappingFieldName in EPropertyCompTypeString.enumMapping) {
            if (EPropertyCompTypeString.enumMapping[mappingFieldName] === val) {
                return mappingFieldName;
            }
        }

        return undefined;
    }
}
*/


export interface EntityObserver {

  getPropTypeInterestMask(): number;
  getOrder(): number;
  update(eventData: PropertyChangeData);
  init();

  fixup(): void;
  unfixup(): void;
}

export class PropertyOwnerHelpers {

  public static observerSortCompare(arg1: EntityObserver, arg2: EntityObserver): number {
    const arg1Order = arg1.getOrder();
    const arg2Order = arg2.getOrder();
    if (arg1Order === arg2Order) {
      return 0;
    }
    return arg1Order < arg2Order ? -1 : 1;
  }
}


export abstract class PropertyOwner {
  protected properties: AnyProperty[] = [];
  protected observers: EntityObserver[] = [];
  protected updatingProperties = false;

  getProperties(): AnyProperty[] {
    return this.properties;
  }
  getPropertyObservers(): EntityObserver[] {
    return this.observers;
  }

  addObserver(observer: EntityObserver) {
    this.observers.push(observer);
    this.observers.sort(PropertyOwnerHelpers.observerSortCompare);

    //const targetPropTypeMask = observer.getPropTypeInterestMask();
    //const matchingProps: AnyProperty[] = [];
    //for (const prop of this.properties) {
    //  if ((prop.type & targetPropTypeMask) !== 0) {
    //    matchingProps.push(prop);
    //  }
    //}
    observer.init();
  }

  removeObserver() {

  }


  processObservers(changeData: PropertyChangeData): void {
    if (this.observers.length > 0) {
        // tracking of nested update types
        if (!this.updatingProperties) {
            this.updatingProperties = true;
        } else {
          changeData.changeMask = changeData.changeMask | EPropertyChangeType.nestedUpdate;
        }

        const changePropType = changeData.property.type;
        for(const observer of this.observers) {
          if((observer.getPropTypeInterestMask() | changePropType) !== 0) {
            observer.update(changeData);
          }
        }

        // leaving the scope of nested updating
        if ((changeData.changeMask & EPropertyChangeType.nestedUpdate) === EPropertyChangeType.none) {
            this.updatingProperties = false;
        }
    }
  }

  abstract getContext(): any;
}

  protected processObserversInternal(prop: AnyProperty, changeType: number, context: TContext): void {
    if (this.observers.length > 0) {
        // tracking of nested update types
        if (!this.updatingProperties) {
            this.updatingProperties = true;
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
            this.updatingProperties = false;
        }
    } else {
      this.updateModifiedValue();
    }
  }

  abstract getContext(): any;
}


export abstract class AnyProperty {
  owner: PropertyOwner;
  info: PropertyInfo;
  type: number = EPropertyCompType.unknown;

  getGenericOwner(): any { return this.owner; }
  abstract getValueAsString(): string;

/*
  protected processChange(changeData: PropertyChangeData) {
    for (const observer of this.owner.getPropertyObservers())
    {
      observer.update(changeData);
    }
  }
*/

  protected onEntityChange(changeData: PropertyChangeData) {}

}


export abstract class CollectionProperty extends AnyProperty{

  getGenericOwner(): any { return this.owner; }

  abstract getItems() : AnyProperty[];
}

export class PropertyChangeData {
  public changeMask: number;
  public readonly property: AnyProperty;
  public readonly context: any;

  constructor(
    property: AnyProperty,
    changeType: number|EPropertyChangeType,
    context: any) {

    this.property = property;
    this.changeMask = changeType;
    this.context = context;
  }
}



