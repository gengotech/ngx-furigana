import { Component, Input } from '@angular/core';

@Component({
  selector: 'character',
  template: `
    <ng-container *ngFor="let char of word.split('')">
      <span class="character" [attr.data-character]="char">{{char}}</span>
    </ng-container>
  `,
  styles: []
})
export class CharacterComponent  {

  @Input() word!: string;

}
