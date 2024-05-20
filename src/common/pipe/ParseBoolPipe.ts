import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBoolPipe implements PipeTransform<any, any> {
  transform(value: any): any {
    // Recursively iterate through the object
    const parseObject = (obj: any): any => {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (
              typeof obj[key] === 'string' &&
              (obj[key].toLowerCase() === 'true' ||
                obj[key].toLowerCase() === 'false')
            ) {
              obj[key] = obj[key].toLowerCase() === 'true';
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              obj[key] = parseObject(obj[key]);
            }
          }
        }
      }
      return obj;
    };

    return parseObject(value);
  }
}
