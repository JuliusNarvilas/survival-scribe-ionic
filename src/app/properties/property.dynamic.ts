import {
    Component,
    ViewContainerRef,
    ViewChild,
    Input,
    OnInit,
    OnDestroy,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory
} from '@angular/core';
import { AnyProperty, EPropertyCompTypeString, EPropertyCompType } from './shared/properties.shared';
import { PropertyIntEditComponent } from './numberComponents/property.int.edit';
import { IntProperty, PropertyComponent } from './properties.app';
import { PropertyIntDisplayComponent } from './numberComponents/property.int.display';
import { PropertyFloatEditComponent } from './numberComponents/property.float.edit';
import { PropertyFloatDisplayComponent } from './numberComponents/property.float.display';
import { PropertyStringEditComponent } from './property.string.edit';
import { PropertyStringDisplayComponent } from './property.string.display';


@Component({
    selector: 'app-property-dynamic',
    template: '<div><div #placeholder></div></div>',
    styleUrls: ['properties.shared.scss']
  })

export class PropertyDynamicComponent implements OnInit, OnDestroy
{
    @ViewChild('placeholder', { static: true, read: ViewContainerRef })
    placeholder: ViewContainerRef;

    @Input()
    propertyTypeStr: string;
    @Input()
    editable = false;

    @Input()
    label: string;
    @Input()
    data: AnyProperty;

    // private componentRef: ComponentRef<{}>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    )
    {}

    ngOnInit()
    {
        this.placeholder.clear();

        let propertyType: number = EPropertyCompType.Unknown;
        if (this.data) {
            propertyType = this.data.typeMetadata;
        } else if (this.propertyTypeStr) {
            propertyType = EPropertyCompTypeString.getEnum(this.propertyTypeStr);
        }

        if (propertyType !== undefined && propertyType !== EPropertyCompType.Unknown) {
            let factory: ComponentFactory<any>;
            const valueObj = new IntProperty(77);

            switch (propertyType) {
                case EPropertyCompType.Int:
                    if (this.editable) {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyIntEditComponent);
                    } else {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyIntDisplayComponent);
                    }
                    break;
                case EPropertyCompType.IntCollection:
                    break;
                case EPropertyCompType.IntExhaustible:
                    break;
                case EPropertyCompType.IntExhaustibleCollection:
                    break;
                case EPropertyCompType.Float:
                    if (this.editable) {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyFloatEditComponent);
                    } else {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyFloatDisplayComponent);
                    }
                    break;
                case EPropertyCompType.FloatCollection:
                    break;
                case EPropertyCompType.FloatExhaustible:
                    break;
                case EPropertyCompType.FloatExhaustibleCollection:
                    break;
                case EPropertyCompType.Enum:
                    break;
                case EPropertyCompType.EnumCollection:
                    break;
                case EPropertyCompType.String:
                    if (this.editable) {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyStringEditComponent);
                    } else {
                        factory = this.componentFactoryResolver.resolveComponentFactory(PropertyStringDisplayComponent);
                    }
                    break;
                case EPropertyCompType.StringCollection:
                    break;
                case EPropertyCompType.Bool:
                    break;
                case EPropertyCompType.BoolCollection:
                    break;
                case EPropertyCompType.AnyCollection:
                    break;
            }

            if (factory) {
                const componentRef = this.placeholder.createComponent(factory);
                if (componentRef && componentRef.instance) {
                    const propertyInst = componentRef.instance as PropertyComponent;
                    propertyInst.label = this.label;
                    propertyInst.setData(valueObj);
                }
            } else {
                console.warn('Dynamic property was given unsupported property type ' + propertyType);
            }
        } else {
            console.warn('Dynamic property was not given a type');
        }

    }

    ngOnDestroy()
    {
        // if (this.componentRef) {
        //     this.componentRef.destroy();
        //     this.componentRef = null;
        // }
        this.placeholder.clear();
    }
}
