import { AnyProperty, EntityProperty } from '../properties/shared/properties.shared';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDefinition } from '../models/models.property.definition';

class AnyPropertyContainer {
  info: PropertyDefinition;
  value: AnyProperty[];
}

export class Entity {
  private static readonly allEntites: Map<string, Entity> = new Map();

  public readonly name: string;
  public readonly id: string;
  private properties: AnyPropertyContainer[] = [];
  //private properties2: Map<string, AnyPropertyContainer> = new Map();

  constructor(name: string, id?: string) {
    this.name = name;
    if (typeof id !== 'undefined') {
      this.id = id;
    } else {
      this.id = uuidv4();
    }
  }


  public static getEntity(name: string): Entity {
    if (name) {
        return Entity.allEntites.get(name);
    }
    return undefined;
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

