

// import { Survivor } from '../models/survivor';
import { Survivor } from 'src/app/characters/Survivor';
import {
  ObservableNumberProperty,
  ObservableNumberReserveProperty } from './data-types/number/prop.number.observable';
import { NumberPropertyChangeData, NumberModifier } from './data-types/number/prop.number';
import { Input } from '@angular/core';
import { AppStateContext } from '../models/models.shared';
import { PropertyModifierDefinition } from '../models/models.property.definition';
import {Interpreter as JSInterpreter} from 'js-interpreter';
import { ScriptExec } from '../libs/scriptExec/scriptExec';
import { EnumProperty } from './shared/properties.shared.enum';
import { EPropertyCompType, AnyProperty } from './shared/prop.shared';



export abstract class AppNumericalModifier extends NumberModifier<AppStateContext>{

  protected makeContext(): AppStateContext {
    return AppStateContext.currentContext;
  }

  public abstract getLable(): string;
  public abstract getDescription(): string;
  public abstract getTags(): string[];
  public abstract serializedDataObj(): string;
}

export class NumericalModifierPredefined extends AppNumericalModifier {
  public static readonly typeNameId = 'ModNumDefined';
  private readonly data: PropertyModifierDefinition;

  static makeFromDataObj(data: any): NumericalModifierPredefined {
    if (data.propType === NumericalModifierPredefined.typeNameId) {
      const definition = NumericalModifierHelper.getDefinition(data.key);
      if (definition) {
        return new NumericalModifierPredefined(definition);
      }
    }
    return undefined;
  }

  static generateDynamicText(template: string, placeholders: { begin: number; length: number }[], appContext: AppStateContext): string {
    let result = '';
    let currentIndex = 0;
    for (const currentPlaceholder of placeholders) {
      if (currentIndex < currentPlaceholder.begin) {
        result += template.substring(currentIndex, currentIndex);
      }
      currentIndex = currentPlaceholder.begin + currentPlaceholder.length;

      const codeStr = template.substring(currentPlaceholder.begin + 1, currentPlaceholder.begin + currentPlaceholder.length - 2);
      if (codeStr !== '') {
        ScriptExec.Run(codeStr, { context: appContext }, (scriptResult: any) => {
          if (typeof scriptResult === 'string') {
            result += scriptResult;
          }
         });
      }
    }
    if (currentIndex < template.length) {
      result += template.substr(currentIndex, template.length - currentIndex);
    }
    return result;
  }

  constructor( data: PropertyModifierDefinition ) {
    super(data.key);
    this.data = data;
  }

  public getLable(): string {
    if (this.data.labelDynamicPoints.length > 0) {
      return NumericalModifierPredefined.generateDynamicText(
        this.data.label,
        this.data.labelDynamicPoints,
        AppStateContext.currentContext
        );
    }
    return this.data.label;
  }

  public getDescription(): string {
    if (this.data.descriptionDynamicPoints.length > 0) {
      return NumericalModifierPredefined.generateDynamicText(
        this.data.description,
        this.data.descriptionDynamicPoints,
        AppStateContext.currentContext
        );
    }
    return this.data.description;
  }

  public getTags(): string[] {
    return this.data.tags;
  }

  public update(eventData: NumberPropertyChangeData<AppStateContext>): void {
    if (this.data.updateCode) {
      ScriptExec.Run(this.data.updateCode, { propertyChange: eventData, context: AppStateContext.currentContext });
    }
  }

  public serializedDataObj(): string {
    return '{ propType: "' + NumericalModifierPredefined.typeNameId + '", key: "' + this.key + '"}';
  }

}



export class NumericalModifierSimple extends AppNumericalModifier {
  public static readonly typeNameId = 'ModNumSimple';

  public readonly label: string;
  public readonly description: string;
  public readonly tags: string[];

  static makeFromDataObj(data: any): NumericalModifierSimple {
    if (data.propType === NumericalModifierSimple.typeNameId) {
      return new NumericalModifierSimple(data.key, data.value, data.label, data.description, data.tags);
    }
    return undefined;
  }

  constructor(modKey: string, modValue: number, modLabel: string, modDescription: string, tags: string[] = []) {
      super(modKey);
      this.tags = tags;
      this.lastValue = modValue;
  }


  update(eventData: NumberPropertyChangeData<AppStateContext>): void {
      eventData.newModification += this.lastValue;
  }

  public getLable(): string {
    return this.label;
  }

  public getDescription(): string {
    return this.description;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public serializedDataObj(): string {
    return '{ propType: "' + NumericalModifierSimple.typeNameId + '", key: "' + this.key + '", ' +
        'label: "' + this.label + '", description: "' + this.description + '", ' +
        'value: ' + this.getModification() + ', tags: ' + JSON.stringify(this.tags) +
        '}';
  }
}


export class NumericalModifierFromEnum extends AppNumericalModifier {
  public static readonly typeNameId = 'ModNumEnum';

  public readonly enumSource: EnumProperty;
  private tags: string[];

  constructor(modKey: string, modValue: number, modLabel: string, modDescription: string, tags: string[] = []) {
      super(modKey);
      this.tags = tags;
      this.tags.push(NumericalModifierFromEnum.typeNameId);
  }


  update(eventData: NumberPropertyChangeData<AppStateContext>): void {
      eventData.newModification += this.lastValue;
  }

  public getLable(): string {
    return this.enumSource.data.enumType.label + ' : '  + this.enumSource.data.value.label;
  }

  public getDescription(): string {
    return this.enumSource.data.value.description;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public serializedDataObj(): string {
    // this modifier is owned by an enum property and is not supposed to serialise
    return undefined;
  }
}


export class NumericalModifierHelper {
    private static allDefinitions: Map<string, PropertyModifierDefinition> = new Map();

    public static deserialiseModifier(data: string): AppNumericalModifier {
      if (data) {
        const dataObj = JSON. parse(data) as { propType: string };
        if (dataObj.propType === NumericalModifierPredefined.typeNameId) {
          return NumericalModifierPredefined.makeFromDataObj(dataObj);
        }
        else if (dataObj.propType === NumericalModifierSimple.typeNameId) {
          return NumericalModifierSimple.makeFromDataObj(dataObj);
        }
      }
      return undefined;
    }

    public static makeModifier(modifierKey: string): AppNumericalModifier {
      const definition = NumericalModifierHelper.allDefinitions.get(modifierKey);
      if (definition) {
        return new NumericalModifierPredefined(definition);
      }
      return undefined;
    }

    public static getDefinition(key: string): PropertyModifierDefinition {
      return NumericalModifierHelper.allDefinitions.get(key);
    }

    public static addDefinition(modDef: PropertyModifierDefinition): void {
      NumericalModifierHelper.allDefinitions.set(modDef.key, modDef);
    }
    public static addDefinitions(modDefs: PropertyModifierDefinition[]): void {
      for (const modDefItem of modDefs) {
        NumericalModifierHelper.allDefinitions.set(modDefItem.key, modDefItem);
      }
    }
  }

