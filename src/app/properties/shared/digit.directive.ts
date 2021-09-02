import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
  } from '@angular/core';

// import { Plugins } from '@capacitor/core';
// import { Platform } from '@ionic/angular';
// const { Clipboard } = Plugins;

@Directive({
    selector: '[digitOnly]',
  })
  export class DigitOnlyDirective implements OnChanges {
    private static readonly navigationKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Clear',
      'Copy',
      'Paste',
    ];

    private hasDecimalPoint = false;

    @Input() decimal = false;
    @Input() canBeNegative = false;
    @Input() decimalSeparator = '.';
    @Input() min = -Infinity;
    @Input() max = Infinity;
    @Input() pattern?: string | RegExp;
    private regex: RegExp;
    inputElement: HTMLInputElement;

    constructor(public el: ElementRef) {
        this.inputElement = el.nativeElement;
    }

    getRealInputElement(): HTMLInputElement {
      // real input element will be created dynamically later by ionic,
      // so we can't get the real input element for ionic input during custruction
        if (this.inputElement.nodeName === 'ION-INPUT') {
            return this.inputElement.getElementsByTagName('input')[0];
        }
        return this.inputElement;
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.pattern) {
        this.regex = this.pattern ? RegExp(this.pattern) : null;
      }

      if (changes.min) {
        const maybeMin = Number(this.min);
        this.min = isNaN(maybeMin) ? -Infinity : maybeMin;
      }

      if (changes.max) {
        const maybeMax = Number(this.max);
        this.max = isNaN(maybeMax) ? Infinity : maybeMax;
      }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent): any {
      if (
        DigitOnlyDirective.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
        (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
        (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
        (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
        (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
        (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
        (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
        (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
        (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
      ) {
        // let it happen, don't do anything
        return;
      }

      let newValue = '';

      if (this.decimal && e.key === this.decimalSeparator) {
        newValue = this.forecastValue(e.key);
        if (newValue.split(this.decimalSeparator).length > 2) { // has two or more decimal points
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        } else {
          this.hasDecimalPoint = newValue.indexOf(this.decimalSeparator) > -1;
          return; // Allow: only one decimal point
        }
      }

      const realInputElement = this.getRealInputElement();

      // check if negative numbers are allowed
      if (e.key !== '-' || this.canBeNegative === false || realInputElement.selectionStart !== 0) {
        // Ensure that it is a number and stop the keypress

        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
        }
      }

      // prevent front zero
      if (e.key === '0')
      {
        const oldValue = realInputElement.value;
        const seperatorIndex = oldValue.indexOf(this.decimalSeparator);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < oldValue.length; i++) {
            if (seperatorIndex === i) {
                // if there were no digits before the decimal point
                // then the zero can be placed anywhere and it will make sense
                break;
            }

            if (oldValue[i] !== '0' && oldValue[i] !== '-') {
              if (realInputElement.selectionStart <= i) {
                // zero does not make sense to be placed
                // before first non-zero number
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return;
              }
              else {
                  // zero can always be placed after the first
                  // non-zero number
                  break;
              }
            }
        }
      }

      newValue = newValue || this.forecastValue(e.key);
      // check the input pattern RegExp
      if (this.regex) {
        if (!this.regex.test(newValue)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return;
        }
      }

      const newNumber = Number(newValue);
      if (newNumber > this.max || newNumber < this.min) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
      let pastedInput: string;

      if (event.clipboardData && event.clipboardData.getData) {
        // Other browsers
        pastedInput = event.clipboardData.getData('text/plain');
      }

      this.pasteData(pastedInput);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent): void {
      const textData = event.dataTransfer.getData('text');
      this.getRealInputElement().focus();
      this.pasteData(textData);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    private pasteData(pastedContent: string): void {
      let sanitizedContent = this.sanitizeInput(pastedContent);
      if (sanitizedContent.length > 0 && this.canBeNegative)
      {
          // negative symbol can only be pasted in front
          if (sanitizedContent[0] === '-' && this.getRealInputElement().selectionStart !== 0)
          {
            sanitizedContent = sanitizedContent.substr(1);
          }
      }
      this.insertTextUnsafe(sanitizedContent);
    }

    private insertTextUnsafe(sanitizedContent: string): void
    {
        const realInputElement = this.getRealInputElement();
        const pasted = document.execCommand('insertText', false, sanitizedContent);
        if (!pasted) {
            if (realInputElement.setRangeText) {
            const { selectionStart: start, selectionEnd: end } = realInputElement;
            realInputElement.setRangeText(sanitizedContent, start, end, 'end');
            } else {
            // Browser does not support setRangeText, e.g. IE
            this.insertAtCursor(realInputElement, sanitizedContent);
            }
        }
        if (this.decimal) {
            this.hasDecimalPoint =
            realInputElement.value.indexOf(this.decimalSeparator) > -1;
        }
    }

    // The following 2 methods were added from the below article for browsers that do not support setRangeText
    // https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position
    private insertAtCursor(myField: HTMLInputElement, myValue: string): void {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;

      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);

      const pos = startPos + myValue.length;
      myField.focus();
      myField.setSelectionRange(pos, pos);

      this.triggerEvent(myField, 'input');
    }

    private triggerEvent(el: HTMLInputElement, type: string): void {
      if ('createEvent' in document) {
        // modern browsers, IE9+
        const e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
      }
    }
    // end stack overflow code

    private sanitizeInput(input: string): string {
      let result = '';
      if (this.decimal && this.isValidDecimal(input)) {
        let regex: RegExp;
        if (this.canBeNegative) {
            regex = new RegExp(`[^-0-9${this.decimalSeparator}]`, 'g');
            result = input.replace(regex, '');

            if (result.length > 0) {
                // leaving only the fist '-' if any
                result = result[0] + result.substr(1).replace('-', '');
                // do not allow just a string of "-"
                if (result.length === 1 && result[0] === '-') {
                    result = '';
                }
            }
        } else {
            regex = new RegExp(`[^0-9${this.decimalSeparator}]`, 'g');
            result = input.replace(regex, '');
        }

        // strip "0" digits at the front
        if (result.length > 0) {
            const numberVal = parseFloat(result);
            result = numberVal.toString();
        }
      } else {
            if (this.canBeNegative) {
                result = input.replace(/[^-0-9]/g, '');
                result = result[0] + result.substr(1).replace('-', '');
            } else {
                result = input.replace(/[^0-9]/g, '');
            }

            // strip "0" digits at the front
            if (result.length > 0) {
                const numberVal = parseInt(result, undefined);
                result = numberVal.toString();
            }
      }

      const realInputElement = this.getRealInputElement();
      const maxLength = realInputElement.maxLength;
      if (maxLength > 0) {
        // the input element has maxLength limit
        const allowedLength = maxLength - realInputElement.value.length;
        result = allowedLength > 0 ? result.substring(0, allowedLength) : '';
      }
      return result;
    }

    private isValidDecimal(text: string): boolean {
      if (!this.hasDecimalPoint) {
        return text.split(this.decimalSeparator).length <= 2;
      } else {
        // the input element already has a decimal separator
        const selectedText = this.getSelection();
        if (selectedText && selectedText.indexOf(this.decimalSeparator) > -1) {
          return text.split(this.decimalSeparator).length <= 2;
        } else {
          return text.indexOf(this.decimalSeparator) < 0;
        }
      }
    }

    private getSelection(): string {
        const realInputElement = this.getRealInputElement();
        return realInputElement.value.substring(
            realInputElement.selectionStart,
            realInputElement.selectionEnd
        );
    }

    private forecastValue(key: string): string {
        const realInputElement = this.getRealInputElement();
        const selectionStart = realInputElement.selectionStart;
        const selectionEnd = realInputElement.selectionEnd;
        const oldValue = realInputElement.value;
        const selection = oldValue.substring(selectionStart, selectionEnd);
        return selection
            ? oldValue.replace(selection, key)
            : oldValue.substring(0, selectionStart) +
                key +
                oldValue.substring(selectionStart);
    }
  }
