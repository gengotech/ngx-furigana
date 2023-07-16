import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

export interface ReadingPair {
  word: string;
  reading: string | null;
}

@Component({
  selector: 'furigana',
  templateUrl: './furigana.component.html',
  styles: []
})
export class FuriganaComponent implements OnInit, OnChanges {

  @Input() word!: string;
  @Input() reading!: string | undefined;
  @Input() showFurigana: boolean = true;
  @Input() splitCharacters: boolean = false;

  readingPairs: ReadingPair[] = [];

  ngOnInit(): void {
    if(this.reading) {
      this.readingPairs = this.applyFurigana(this.reading, this.word);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.readingPairs = [];
    this.ngOnInit();
  }

  isKanji(ch: string): boolean {
    return (ch >= '\u4e00' && ch <= '\u9faf') || (ch >= '\u3400' && ch <= '\u4dbf');
  }

  isHiragana(ch: string): boolean {
    return ch >= '\u3041' && ch <= '\u3096';
  }

  getKanaSubstrings(s: string): string[] {
    let result = '';
    for (const ch of s) {
      if (this.isKanji(ch)) {
        result += ' ';
      } else {
        result += ch;
      }
    }
    // Split by space and remove empty strings
    return result.trim().split(' ').filter(x => x !== '');
  }

  splitByKanaSubstrings(word: string, delimiters: string[]): string[] {
    // Sort delimiters by length, descending, to avoid partial matches
    delimiters.sort((a, b) => b.length - a.length);

    // Escape any characters that have special meaning in a regex
    let escapedDelimiters = delimiters.map(d => d.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Use lookaheads and lookbehinds to keep delimiters
    let regex = new RegExp(`(?<=${escapedDelimiters.join("|")})|(?=${escapedDelimiters.join("|")})`, "g");

    return word.split(regex).filter(x => x !== '');
  }

  private hasHiraganaBetweenKanji(s: string): boolean {
    let foundKanji = false;
    let foundHiragana = false;

    for (const ch of s) {
      if (this.isKanji(ch)) {
        if (foundKanji && foundHiragana) {
          return true;
        }

        foundKanji = true;

        if (foundHiragana) {
          foundHiragana = false;
        }
      } else if (this.isHiragana(ch)) {
        if (foundKanji) {
          foundHiragana = true;
        }
      } else {
        foundKanji = false;
        foundHiragana = false;
      }
    }

    return false;
  }

  applyFurigana(reading: string, word: string): ReadingPair[] {
    let readingPairs: ReadingPair[] = [];

    if(this.hasHiraganaBetweenKanji(word)) {
      let word = this.getKanaSubstrings(this.word);
      let wordSplit = this.splitByKanaSubstrings(this.word, word)
      let readingSplit = this.splitByKanaSubstrings(this.reading!, word)

      let currentWord = '';

      console.info(wordSplit);

      for(let i = 0; i < wordSplit.length; i++) {
        if(wordSplit[i] === readingSplit[i]) {
          currentWord += wordSplit[i];
          continue;
        } else {
          if(currentWord !== '') {
            readingPairs.push({ word: currentWord, reading: null });
            currentWord = '';
          }
        }
        readingPairs.push({ word: wordSplit[i], reading: readingSplit[i] });
      }

      return readingPairs;
    }

    // Convert word and reading to sets of unique characters
    const wordSet = new Set(word);
    const readingSet = new Set(reading);

    // Check if there are any matching characters
    const intersection = new Set([...wordSet].filter(x => readingSet.has(x)));

    if (reading.length === 0 || reading === word || intersection.size === 0) {
      readingPairs.push({ word: this.word, reading: this.reading! });
      return readingPairs;
    }

    let i = 1;
    let matchingPartBack = '';

    // Finding matching part in the back
    while (i <= word.length && i <= reading.length && word.slice(-i) === reading.slice(-i)) {
      matchingPartBack = word.slice(-i);
      i++;
    }

    i = 1;
    let matchingPartFront = '';

    // Finding matching part in the front
    while (i <= word.length && i <= reading.length && word.slice(0, i) === reading.slice(0, i)) {
      matchingPartFront = word.slice(0, i);
      i++;
    }

    if(matchingPartFront) {
      readingPairs.push({ word: matchingPartFront, reading: null });
    }
    readingPairs.push({ word: word.slice(matchingPartFront.length, word.length - matchingPartBack.length), reading: reading.slice(matchingPartFront.length, reading.length - matchingPartBack.length) });

    if(matchingPartBack) {
      readingPairs.push({ word: matchingPartBack, reading: null });
    }

    return readingPairs;
  }


}
