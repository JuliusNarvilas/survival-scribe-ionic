import { PropertyDefinition } from '../models/models.property.definition';
import { AnyProperty } from '../properties/shared/prop.shared';


export class CharacterDefinition
{
    properties: PropertyDefinition[] = [];
}

export class CharacterInstance {
    id = '';
    parents: string[] = [];
    children: string[] = [];

    properties: AnyProperty[] = [];
}
