import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadingPair} from "./reading-pair.interface";
import {FuriganaService} from "./furigana.service";
import {TransliterateService} from "./transliterate.service";

@Component({
  selector: 'furigana',
  templateUrl: './furigana.component.html',
  styles: []
})
export class FuriganaComponent implements OnInit, OnChanges {

  @Input() word!: string;
  @Input() reading!: string | undefined;
  @Input() showFurigana: boolean = true;

  transliteredWord: string | null = null;

  readingPairs: ReadingPair[] = [];

  constructor(private furiganaService: FuriganaService, private transliterateService: TransliterateService) { }

  ngOnInit(): void {
    if (this.reading) {
      this.transliteredWord = this.transliterateService.convertHiraganaInAtoKatakana(this.reading, this.word);
      this.readingPairs = this.furiganaService.getReadingPairs(this.transliteredWord, this.word);
      console.log(this.readingPairs);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.readingPairs = [];
    this.ngOnInit();
  }

}
