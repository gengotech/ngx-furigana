# Furigana for Angular

![example](https://raw.githubusercontent.com/gengotech/ngx-furigana/master/example-0.png)

An Angular component that intelligently displays Furigana.

It was built in order to display Japanese text and readings programatically from sources such as JMdict.


```html
<!-- Kana between Kanji -->
<furigana word="日の人" reading="ひのひと"></furigana>

<!-- Kana between Kanji -->
<furigana word="あの日の人" reading="あのひのひと"></furigana>

<!-- Trailing kana -->
<furigana word="対抗する" reading="たいこうする"></furigana>

<!-- Kanji between kana  -->
<furigana word="ぶん回す" reading="ぶんまわす"></furigana>

<!-- Full kana  -->
<furigana word="稲葉曇" reading="いなばくもり"></furigana>

<!-- Full kana  -->
<furigana word="日" reading="にち"></furigana>
```

# Installation

`npm install @gengotech/ngx-furigana --save`

Add `NgxFuriganaModule` to your `app.module.ts` imports:

```typescript
import { NgxFuriganaModule } from '@gengotech/ngx-furigana';

@NgModule({
 
  imports: [
    NgxFuriganaModule
  ],
  
})
```

# Usage

```html
<furigana [word]="対抗する'" [reading]="'たいこうする'"></furigana>
```

![example](https://raw.githubusercontent.com/gengotech/ngx-furigana/master/example-1.png)

As you can see, the "する" part is automatically ignored even if it is present in the reading.



It can also handle words where there's kana on both ends:

```html
<furigana [word]="'ぶん回す'" [reading]="'ぶんまわす'"></furigana>
```

![example](https://raw.githubusercontent.com/gengotech/ngx-furigana/master/example-2.png)

# API

If any of the inputs are changed, the component will automatically re-render.

### Inputs
| Name                       | Type               | Default      | Description                                                                                                                                                                                                                                                                                                                           |
|----------------------------|--------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `word`                     | string             |              | The main word that will be displayed.                                                                                                                                                                                                                                                                                                 |
| `reading`                  | string             |              | The reading for the word.                                                                                                                                                                                                                                                                                                             |
| `showFurigana`             | boolean            | true         | Optional switch to turn off furigana display.                                                                                                                                                                                                                                                                                         |
