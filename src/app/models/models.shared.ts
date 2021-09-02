import { Survivor } from '../characters/Survivor';
import { NumericalModifier, NumericalPropertyChangeData } from '../properties/shared/properties.shared.number';
import { AnyProperty } from '../properties/shared/properties.shared';

export class AppStateContext {
    static readonly currentContext: AppStateContext;

    public survivor: Survivor;
    public property: AnyProperty;
}


