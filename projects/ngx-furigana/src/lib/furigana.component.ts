import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadingPair} from "./reading-pair.interface";
import {FuriganaService} from "./furigana.service";
import {TransliterateService} from "./transliterate.service";
import * as wanakana from 'wanakana';

@Component({
  selector: 'furigana',
  templateUrl: './furigana.component.html',
  styles: []
})
export class FuriganaComponent implements OnInit, OnChanges {

  @Input() word!: string;
  @Input() reading!: string | undefined;
  @Input() showFurigana: boolean = true;
  @Input() forceRomaji: boolean = false;

  originalReading: string | null = null;
  romajiReading: string | null = null;

  transliteredWord: string | null = null;

  readingPairs: ReadingPair[] = [];

  constructor(public furiganaService: FuriganaService, private transliterateService: TransliterateService) { }

  ngOnInit(): void {
    if (this.reading) {
      this.romajiReading = wanakana.toRomaji(this.reading);

      if (!this.originalReading) {
        this.originalReading = this.reading;
      }

      if(this.forceRomaji) {
        this.reading = this.romajiReading;
      } else {
        this.reading = this.originalReading;
      }

      this.transliteredWord = this.transliterateService.convertHiraganaInAtoKatakana(this.reading, this.word);
      this.readingPairs = this.furiganaService.getReadingPairs(this.transliteredWord, this.word);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('reading')) {
      this.originalReading = changes['reading'].currentValue;
      this.reading = changes['reading'].currentValue;
    }

    this.readingPairs = [];
    this.ngOnInit();
  }

}
