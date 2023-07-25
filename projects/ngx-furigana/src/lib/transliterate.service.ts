import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransliterateService {

  convertHiraganaInAtoKatakana(inputA: string, inputB: string): string {
    if(inputA.length != inputB.length) return inputA;
    let output = "";
    for (let i = 0; i < inputA.length; i++) {
      let charA = inputA[i];
      let charB = inputB[i];
      let codeA = charA.charCodeAt(0);
      let codeB = charB.charCodeAt(0);

      if (codeA >= 0x3041 && codeA <= 0x3096 && codeB >= 0x30A1 && codeB <= 0x30F6) {
        output += String.fromCharCode(codeA + 96);
      } else {
        output += charA;
      }
    }

    return output;
  }



}
