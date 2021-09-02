import { Injectable } from '@angular/core';
import { ParseResult } from './interfaces/parse-result';
import { ParseConfig } from './interfaces/parse-config';
import { UnparseConfig } from './interfaces/unparse-config';
import * as lib from 'papaparse/papaparse.min.js';

@Injectable({
    providedIn: 'root',
})
export class Papa {

    static readonly instance = new Papa();

    public papaJS = lib;

    /**
     * Parse CSV to an array
     */
    public parse(csv: string|Blob, config?: ParseConfig): ParseResult {
        return this.papaJS.parse(csv, config);
    }

    /**
     * Convert an array into CSV
     */
    public unparse(data, config?: UnparseConfig): string {
        return this.papaJS.unparse(data, config);
    }

    /**
     * Set the size in bytes of each file chunk.
     * Used when streaming files obtained from the DOM that
     * exist on the local computer. Default 10 MB.
     */
    public setLocalChunkSize(value: number): void {
        this.papaJS.LocalChunkSize = value;
    }

    /**
     * Set the size in bytes of each remote file chunk.
     * Used when streaming remote files. Default 5 MB.
     */
    public setRemoteChunkSize(value: number): void {
        this.papaJS.RemoteChunkSize = value;
    }

    /**
     * Set the delimiter used when it is left unspecified and cannot be detected automatically. Default is comma.
     */
    public setDefaultDelimiter(value: string): void {
        this.papaJS.DefaultDelimiter = value;
    }

    /**
     * An array of characters that are not allowed as delimiters.
     */
    get badDelimiters() {
        return this.papaJS.BAD_DELIMITERS;
    }

    /**
     * The true delimiter. Invisible. ASCII code 30.
     * Should be doing the job we strangely rely upon commas and tabs for.
     */
    get recordSeparator() {
        return this.papaJS.RECORD_SEP;
    }

    /**
     * Also sometimes used as a delimiting character. ASCII code 31.
     */
    get unitSeparator() {
        return this.papaJS.UNIT_SEP;
    }

    /**
     * Whether or not the browser supports HTML5 Web Workers.
     * If false, worker: true will have no effect.
     */
    get workersSupported(): boolean {
        return this.papaJS.WORKERS_SUPPORTED;
    }
}
