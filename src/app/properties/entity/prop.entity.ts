import { AnyProperty, CollectionProperty, EPropertyCompType, PropertyData, PropertyObserver } from '../shared/prop.shared';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDefinition } from '../models/models.property.definition';
import { UrlMatcher } from '@angular/router';
import { EntityObserver, PropertyInfo } from '../shared/prop.shared';

class AnyPropertyContainer {
  info: PropertyDefinition;
  value: AnyProperty[];
}


export class EntityData {
  key = '';

  properties: PropertyData[] = [];
}


export class EntityContainerProperty extends AnyProperty {
  public data: Entity[] = [];

  getValueAsString(): string {
    let result = this.info.label + ' : [';
    let loopCounter = 0;
    for (const entityData of this.data) {
      if (++loopCounter < this.data.length) {
        result += entityData.name + ', ';
      } else {
        result += entityData.name;
      }
    }
    result += ']';
    return result;
  }
}

export class EntitySearchParam {
  propKey: string;
  match: string;
}

/**
 * Entity class is a collection of
 */
export class Entity {
  private static readonly allEntites: Entity[] = [];
  public static readonly globalObservers: EntityObserver[] = [];

  public readonly id: string;

  private readonly properties: Map<string, AnyProperty> = new Map();
  private readonly observers: PropertyObserver[] = [];

  constructor(id?: string) {
    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = uuidv4();
    }
  }


  public static getEntity(id: string): Entity {
    if (id !== undefined && id !== null) {
      for (var currentEntity of Entity.allEntites) {
        if (currentEntity.id == id) {
          return currentEntity;
        }
      }
    }
    return undefined;
  }

  public static findEntity(searchData: EntitySearchParam[]): Entity[] {

    const matchFunc = (prop: AnyProperty, targetVal: string) => {
      const propVal = prop.getValueAsString();
      if ((prop.type & EPropertyCompType.text) !== 0) {
        return propVal.indexOf(targetVal) !== -1;
      }
      else {
        return propVal == targetVal;
      }
    };

    let result = Entity.allEntites;
    for (let searchParam of searchData) {
      const searchParamResult: Entity[] = [];

      for (let currentEntity of result) {
        const foundProp = currentEntity.properties.get(searchParam.propKey);
        if (foundProp !== undefined) {
          if((foundProp.type & EPropertyCompType.collection) !== 0)
          {
            const collectionProp = foundProp as CollectionProperty;
            const childPropArray = collectionProp.getItems();
            for (let childProp of childPropArray)
            {
              if (matchFunc(childProp, searchParam.match)) {
                searchParamResult.push(currentEntity);
                break;
              }
            }
          } else {
            if (matchFunc(foundProp, searchParam.match)) {
              searchParamResult.push(currentEntity);
            }
          }
        }
      }
      result = searchParamResult;
    }

    return result;
  }

  public static registerEntity(name: string, value: Entity) {
    if (name && value) {
      Entity.allEntites.set(name, value);
    }
  }

  getProperty(expression: string) : AnyPropertyContainer {
    const searchKeys = expression.split('.');
    let result = undefined;
    let searchEntity = this;
    for(let i = 0; i < searchKeys.length; ++i) {
      const currentSearchKey = searchKeys[i];
      let found = false;
      for (const propContainer of searchEntity.properties) {
        if (propContainer.info.key === currentSearchKey) {
          if (propContainer.value instnaceof EntityProperty) {

          }
          found = true;
        }
      }
    }

    return result;
  }

}

export class EntityManager {

}

