import { AnyProperty } from '../properties/shared/properties.shared';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDefinition } from '../models/models.definitions';

class AnyPropertyContainer {
  info: PropertyDefinition;
  value: AnyProperty[];
}

export class Entity {
  public readonly name: string;

  id: string;
  private properties: AnyPropertyContainer[] = [];
  //private properties2: Map<string, AnyPropertyContainer> = new Map();

  constructor(name: string) {
    this.id = uuidv4();
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
          if (propContainer.value instnaceof EntityProperty && )
          found = true;
        }
      }
    }

    return result;
  }

}

