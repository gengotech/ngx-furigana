import {FuriganaComponent, ReadingPair} from "./furigana.component";

describe('FuriganaComponent', () => {
  let component: FuriganaComponent;

  beforeEach(() => {
    component = new FuriganaComponent();
  });

  it('kana between kanji with no trailing or leading kana', () => {
    const word = '日の人';
    const reading = 'ひのひと';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: '日', reading: 'ひ'},
      {word: 'の', reading: null},
      {word: '人', reading: 'ひと'}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

  it('kana between kanji with trailing kana', () => {
    const word = 'あの日の人';
    const reading = 'あのひのひと';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: 'あの', reading: null},
      {word: '日', reading: 'ひ'},
      {word: 'の', reading: null},
      {word: '人', reading: 'ひと'}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

  it('trailing kana only', () => {
    const word = '対抗する';
    const reading = 'たいこうする';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: '対抗', reading: 'たいこう'},
      {word: 'する', reading: null}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

  it('kanji between kana', () => {
    const word = 'ぶん回す';
    const reading = 'ぶんまわす';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: 'ぶん', reading: null},
      {word: '回', reading: 'まわ'},
      {word: 'す', reading: null}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

  it('full kanji 3 characters', () => {
    const word = '稲葉曇';
    const reading = 'いなばくもり';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: '稲葉曇', reading: 'いなばくもり'}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

  it('full kanji 1 character', () => {
    const word = '日';
    const reading = 'にち';
    component.word = word;
    component.reading = reading;

    const result = component.applyFurigana(reading, word);
    const expectedReadingPairs: ReadingPair[] = [
      {word: '日', reading: 'にち'}
    ];
    expect(result).toEqual(expectedReadingPairs);
  });

});
