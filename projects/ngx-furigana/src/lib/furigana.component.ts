import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReadingPair} from "./reading-pair.interface";
import {FuriganaService} from "./furigana.service";

@Component({
  selector: 'furigana',
  templateUrl: './furigana.component.html',
  styles: []
})
export class FuriganaComponent implements OnInit, OnChanges {

  @Input() word!: string;
  @Input() reading!: string | undefined;
  @Input() showFurigana: boolean = true;

  readingPairs: ReadingPair[] = [];

  constructor(private furiganaService: FuriganaService) { }

  ngOnInit(): void {
    if (this.reading) {
      this.readingPairs = this.furiganaService.getReadingPairs(this.reading, this.word);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.readingPairs = [];
    this.ngOnInit();
  }


}
