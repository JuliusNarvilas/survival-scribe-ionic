import { AnyProperty, PropertyInfo, PropertyObserver } from '../shared/prop.shared';
import { v4 as uuidv4 } from 'uuid';
import { PropertyDefinition } from '../../models/models.property.definition';

export class EntityInfo {
  private static readonly allEntites: Map<string, any> = new Map();

  public readonly key: string;
  private readonly properties: PropertyInfro[] = [];
  private readonly observers: PropertyObserver[] = [];

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
