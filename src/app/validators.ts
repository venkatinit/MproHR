import { AbstractControl, ValidatorFn } from '@angular/forms';

export function percentageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const percentagePattern = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)%?$/; // Regular expression for 0-100 percentage
      const value = parseFloat(control.value);
  
      if (isNaN(value) || value < 0 || value > 100 || !percentagePattern.test(control.value)) {
        return { 'invalidPercentage': true };
      }
  
      return null;
    };
  }
