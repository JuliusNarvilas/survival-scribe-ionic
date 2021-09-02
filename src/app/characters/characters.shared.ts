import { PropertyDefinition } from '../models/models.definitions';
import { AnyProperty } from '../properties/shared/properties.shared';


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
