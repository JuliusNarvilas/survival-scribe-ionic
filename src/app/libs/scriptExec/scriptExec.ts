import { Injectable } from '@angular/core';
// import * as vmLib from 'vm';
import * as JSInterpreter from 'js-interpreter';

/*
@Injectable({
    providedIn: 'root',
})
*/

/*
export class ScriptInstance {
    private static readonly DEFAULT_RUN_OPTIONS = {
        // displayErrors: false,
        timeout: 1000
    };

    private vmScript: vmLib.Script;
    private vmContext: vmLib.Context;

    constructor(internalStruct: vmLib.Script)
    {
        this.vmScript = internalStruct;
        this.vmContext = undefined;
    }

    public SetupContext()
    {
        if (this.vmContext === undefined)
        {
            this.vmContext =  vmLib.createContext(undefined, {
                codeGeneration: {
                    strings: false,
                    wasm: false
                }
            });
        }
    }

    public Run(successCall?: (result: any) => void, failureCall?: (e: any) => void)
    {
        this.SetupContext();

        try {
            const result = this.vmScript.runInContext(this.vmContext, ScriptInstance.DEFAULT_RUN_OPTIONS);
            if (successCall !== undefined && successCall !== null)
            {
                successCall(result);
            }
        } catch (e) {
            console.log(e);
            if (failureCall !== undefined && failureCall !== null)
            {
                failureCall(e);
            }
        }
    }
}

export class ScriptExec {
    public vmJS = vmLib;

    public static Run(code: string, sandbox?: any, successCall?: (result: any) => void, failureCall?: (e: any) => void) {
        if (sandbox === undefined || sandbox === null)
        {
            sandbox = {};
        }
        if (sandbox.console === undefined )
        {
            sandbox.console = console;
        }

        const options = {
            timeout : 1000,
            contextCodeGeneration: {
                strings: false,
                wasm: false
            }
        };

        const scriptInst = new vmLib.Script('var test = 10;');
        console.log(JSON.stringify(scriptInst));

        console.log(JSON.stringify(vmLib));

        try {
            const result = vmLib.runInNewContext(code, sandbox, options);
            if (successCall !== undefined && successCall !== null)
            {
                successCall(result);
            }
        } catch (e) {
            console.log(e);
            if (failureCall !== undefined && failureCall !== null)
            {
                failureCall(e);
            }
        }
    }

    public BuildScript(code: string): ScriptInstance
    {
        const internalScript = new vmLib.Script(code, {
            // displayErrors: false,
            timeout: 1000
        });
        return new ScriptInstance(internalScript);
    }

    public Run(code: string, sandbox?: any, successCall?: (result: any) => void, failureCall?: (e: any) => void)
    {
        ScriptExec.Run(code, sandbox, successCall, failureCall);
    }
}
*/


export class ScriptExec {

    public static Run(code: string, sandbox?: any, successCall?: (result: any) => void, failureCall?: (e: any) => void) {

        if (sandbox === undefined || sandbox === null)
        {
            sandbox = {};
        }
        if (sandbox.console === undefined )
        {
            sandbox.console = console;
        }

        const initFunc = (interpreter: any, globalObject: any) => {
            Object.keys(sandbox).forEach((key, index) => {
                // key: the name of the object key
                // index: the ordinal position of the key within the object
                const val = sandbox[key];
                if (val !== undefined && val !== null)
                {
                    interpreter.setProperty(globalObject, key, interpreter.nativeToPseudo(val));
                }
            });
        };

        try {
            const myInterpreter = new JSInterpreter(code, initFunc);
            myInterpreter.run();

            if (successCall !== undefined && successCall !== null)
            {
                successCall(myInterpreter.value);
            }
        } catch (e) {
            console.log(e);
            if (failureCall !== undefined && failureCall !== null)
            {
                failureCall(e);
            }
        }
    }

    public Run(code: string, sandbox?: any, successCall?: (result: any) => void, failureCall?: (e: any) => void)
    {
        ScriptExec.Run(code, sandbox, successCall, failureCall);
    }
}


