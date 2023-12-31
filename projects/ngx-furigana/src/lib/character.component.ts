import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

interface Character {
  id: string;
  text: string;
}

@Component({
  selector: 'character',
  template: `
    <ng-container *ngFor="let character of this.characterList">
      <span class="character" [attr.data-character]="character.text" [id]="character.id">{{character.text}}</span>
    </ng-container>
  `,
  styles: []
})
export class CharacterComponent implements OnInit, OnChanges {

  @Input() word!: string

  characterList: Character[] = [];

  ngOnInit(): void {
    this.characterList = [];
    this.word.split('').forEach((char) => {
      this.characterList.push({text: char, id: uuidv4()});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

}
