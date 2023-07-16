import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgxFuriganaModule} from "../../../ngx-furigana/src/lib/ngx-furigana-component.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxFuriganaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
