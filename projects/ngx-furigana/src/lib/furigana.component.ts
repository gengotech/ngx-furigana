import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

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

  wordWithoutMatchingPart!: string;
  readingWithoutMatchingPart!: string;
  matchingPartBack!: string;
  matchingPartFront!: string;

  ngOnInit(): void {
    if(this.reading) {
      this.applyFurigana(this.reading, this.word);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.wordWithoutMatchingPart = '';
    this.readingWithoutMatchingPart = '';
    this.matchingPartFront = '';
    this.matchingPartBack = '';

    this.ngOnInit();
  }

  applyFurigana(reading: string, word: string): void {
    // Convert word and reading to sets of unique characters
    const wordSet = new Set(word);
    const readingSet = new Set(reading);

    // Check if there are any matching characters
    const intersection = new Set([...wordSet].filter(x => readingSet.has(x)));

    if (reading.length === 0 || reading === word || intersection.size === 0) {
      this.wordWithoutMatchingPart = this.word;
      this.readingWithoutMatchingPart = this.reading!;
      this.matchingPartFront = '';
      this.matchingPartBack = '';
      return;
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

    this.matchingPartFront = matchingPartFront;
    this.matchingPartBack = matchingPartBack;
    this.wordWithoutMatchingPart = word.slice(matchingPartFront.length, word.length - matchingPartBack.length);
    this.readingWithoutMatchingPart = reading.slice(matchingPartFront.length, reading.length - matchingPartBack.length);
  }


}
