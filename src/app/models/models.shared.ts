import { Survivor } from '../characters/Survivor';
import { NumberModifier, NumberPropertyChangeData } from '../properties/shared/properties.shared.number';
import { AnyProperty } from '../properties/shared/prop.shared';

export class AppStateContext {
    static readonly currentContext: AppStateContext;

    public survivor: Survivor;
    public property: AnyProperty;
}


