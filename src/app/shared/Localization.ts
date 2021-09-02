import { Injectable, AfterContentInit } from '@angular/core';
import { Papa } from 'src/app/libs/papaparse/papaparse';

@Injectable()
export class LocalizationService {

    private static sInstance: LocalizationService;
    valueMap: Map<string, string> = new Map();

    static getText(key: string) {
        if (LocalizationService.sInstance) {
            return LocalizationService.sInstance.getText(key);
        }

        return undefined;
    }

    static setFromCSV(csvText: string) {
        if (LocalizationService.sInstance) {
            LocalizationService.sInstance.setFromCSV(csvText);
        } else {
            const newInst = new LocalizationService(new Papa());
            newInst.setFromCSV(csvText);
        }
    }

  constructor(private csvParser: Papa) {
      if (LocalizationService.sInstance === undefined) {
        LocalizationService.sInstance = this;
      }
  }


  clear() {
    this.valueMap.clear();
  }

  setFromCSV(csvText: string): boolean {
    const result = this.csvParser.parse(csvText);
    if (result.errors.length > 0) {
        for (const err of result.errors) {
            console.error('error: ' + err.code + ' , ' + err.type + ' (row ' + err.row + ') ' + err.message);
        }
        return false;
    }

    const resultArray = result.data as string[][];
    const rowCount = resultArray.length;
    for (let rowI = 0; rowI < rowCount; ++rowI) {
        const rowData = resultArray[rowI];
        this.valueMap.set(rowData[0], rowData[1]);
    }
    return true;
  }

  getText(key: string): string {
    return this.valueMap.get(key);
  }
}
