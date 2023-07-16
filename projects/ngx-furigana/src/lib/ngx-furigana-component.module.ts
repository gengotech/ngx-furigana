import { NgModule } from '@angular/core';
import {FuriganaComponent} from "./furigana.component";
import {CharacterComponent} from "./character.component";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";

@NgModule({
  declarations: [
    FuriganaComponent,
    CharacterComponent
  ],
  imports: [
    NgIf,
    NgForOf,
    JsonPipe
  ],
  exports: [
    FuriganaComponent
  ]
})
export class NgxFuriganaModule { }
