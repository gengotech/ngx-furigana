import {Injectable} from '@angular/core';
import {ReadingPair} from "./reading-pair.interface";

@Injectable({
  providedIn: 'root'
})
export class FuriganaService {

  /**
   * Determines if a character is a Japanese character.
   *
   * @param {string} ch - A single character string.
   * @returns {boolean} - True if the character is Japanese, false otherwise.
   */
  isCharacterJapanese(ch: string): boolean {
    const code = ch.charCodeAt(0);

    // Hiragana
    if (code >= 0x3040 && code <= 0x309F) return true;

    // Katakana
    if (code >= 0x30A0 && code <= 0x30FF) return true;

    // CJK Unified Ideographs - Common and Uncommon Kanji
    if (code >= 0x4E00 && code <= 0x9FFF) return true;

    // Katakana Phonetic Extensions
    if (code >= 0x31F0 && code <= 0x31FF) return true;

    return false;
  }

  /**
   * Determines if a string contains only Japanese characters.
   *
   * @param {string} str - The string to be checked.
   * @returns {boolean} - True if all characters in the string are Japanese, false otherwise.
   */
  isJapanese(str: string): boolean {
    for (const ch of str) {
      if (!this.isCharacterJapanese(ch)) return false;
    }
    return true;
  }

  /**
   * Determines if a given character is a Kanji.
   *
   * @param {string} character - The character to check.
   * @returns {boolean} True if the character is a Kanji; otherwise, false.
   */
  private isKanji(character: string): boolean {
    return (character >= '\u4e00' && character <= '\u9faf') || (character >= '\u3400' && character <= '\u4dbf');
  }

  /**
   * Determines if a given character is a Hiragana.
   *
   * @param {string} character - The character to check.
   * @returns {boolean} True if the character is a Hiragana; otherwise, false.
   */
  private isHiragana(character: string): boolean {
    return character >= '\u3041' && character <= '\u3096';
  }

  /**
   * Extracts Kana substrings from a given string.
   *
   * @param {string} text - The string to process.
   * @returns {string[]} An array of Kana substrings.
   */
  private getKanaSubstrings(text: string): string[] {
    let result = '';
    for (const character of text) {
      result += this.isKanji(character) ? ' ' : character;
    }
    // Split by space and remove empty strings
    return result.trim().split(' ').filter(substring => substring !== '');
  }

  /**
   * Splits the given word by Kana substrings using the provided delimiters.
   *
   * @param {string} word - The word to split.
   * @param {string[]} delimiters - The delimiters to use for splitting.
   * @returns {string[]} An array of the word's parts.
   */
  private splitByKanaSubstrings(word: string, delimiters: string[]): string[] {
    // Sort delimiters by length, descending, to avoid partial matches
    delimiters.sort((a, b) => b.length - a.length);

    // Escape any characters that have special meaning in a regex
    const escapedDelimiters = delimiters.map(delimiter => delimiter.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Use lookaheads and lookbehinds to keep delimiters
    const delimiterPattern = escapedDelimiters.join("|");
    const regex = new RegExp(`(?<=${delimiterPattern})|(?=${delimiterPattern})`, "g");

    return word.split(regex).filter(part => part !== '');
  }

  /**
   * Checks if a string contains a Hiragana character between Kanji characters.
   *
   * @param {string} text - The text to check.
   * @returns {boolean} True if there is a Hiragana character between Kanji characters; otherwise, false.
   */
  private hasHiraganaBetweenKanji(text: string): boolean {
    let foundKanji = false;
    let foundHiragana = false;

    for (const character of text) {
      if (this.isKanji(character)) {
        if (foundKanji && foundHiragana) {
          return true;
        }

        foundKanji = true;
        foundHiragana = false;
      } else if (this.isHiragana(character)) {
        foundHiragana = foundKanji;
      } else {
        foundKanji = false;
        foundHiragana = false;
      }
    }

    return false;
  }

  /**
   * Applies Furigana readings to the given word and returns a list of ReadingPairs.
   *
   * @param {string} reading - The reading to apply.
   * @param {string} word - The word to apply the reading to.
   * @returns {ReadingPair[]} An array of ReadingPairs.
   */
  getReadingPairs(reading: string, word: string): ReadingPair[] {
    let pairs = this.calculatePairs(word, reading);
    pairs.forEach((pair) => {
      if(pair.word == pair.reading) {
        pair.reading = null;
      }
    })
    return pairs;
  }

  private calculatePairs(word: string, reading: string) {
    const readingPairs: ReadingPair[] = [];

    if (this.hasHiraganaBetweenKanji(word)) {
      const kanaSubstrings = this.getKanaSubstrings(word);
      const wordSplit = this.splitByKanaSubstrings(word, kanaSubstrings)
      const readingSplit = this.splitByKanaSubstrings(reading, kanaSubstrings)

      return this.mergeWordReadingPairs(wordSplit, readingSplit);
    }

    const commonCharacters = this.getCommonCharacters(word, reading);
    if (reading.length === 0 || reading === word || commonCharacters.size === 0) {
      readingPairs.push({word: word, reading: reading});
      return readingPairs;
    }

    const [matchingPartFront, matchingPartBack] = this.getMatchingParts(word, reading);
    const builtReadingPairs = this.buildReadingPairs(matchingPartFront, matchingPartBack, word, reading);

    // We remove the readings on specific characters like "ー"
    const readingPairsWithoutSpecificReadings = builtReadingPairs.map(pair => {
      if (pair.word === "ー" || pair.word === "〜" || pair.word === "～" || pair.word == "ｰ") {
        pair.reading = null;
      }
      return pair;
    });

    return readingPairsWithoutSpecificReadings;
  }

  /**
   * Merges word and reading pairs.
   *
   * @param {string[]} wordSplit - The split words.
   * @param {string[]} readingSplit - The split readings.
   * @returns {ReadingPair[]} An array of merged ReadingPairs.
   */
  private mergeWordReadingPairs(wordSplit: string[], readingSplit: string[]): ReadingPair[] {
    return wordSplit.map((word, index) => {
      const reading = word === readingSplit[index] ? null : readingSplit[index];
      return {word: word, reading: reading};
    }).reduce((pairs: ReadingPair[], currentPair: ReadingPair, index, array) => {
      if (currentPair.reading === null && index > 0 && array[index - 1].reading === null) {
        pairs[pairs.length - 1].word += currentPair.word;
      } else {
        pairs.push(currentPair);
      }
      return pairs;
    }, [] as ReadingPair[]);
  }

  /**
   * Gets the common characters between two strings.
   *
   * @param {string} text1 - The first string.
   * @param {string} text2 - The second string.
   * @returns {Set<string>} A Set of common characters.
   */
  private getCommonCharacters(text1: string, text2: string): Set<string> {
    const text1Set = new Set(text1);
    const text2Set = new Set(text2);
    return new Set([...text1Set].filter(character => text2Set.has(character)));
  }

  /**
   * Gets the matching parts at the start and end of two strings.
   *
   * @param {string} text1 - The first string.
   * @param {string} text2 - The second string.
   * @returns {[string, string]} A pair of matching parts ([matchingPartFront, matchingPartBack]).
   */
  private getMatchingParts(text1: string, text2: string): [string, string] {
    let matchingPartFront = '';
    let matchingPartBack = '';

    for (let i = 1; i <= Math.min(text1.length, text2.length); i++) {
      if (text1.slice(0, i) === text2.slice(0, i)) {
        matchingPartFront = text1.slice(0, i);
      } else {
        break;
      }
    }

    for (let i = 1; i <= Math.min(text1.length, text2.length); i++) {
      if (text1.slice(-i) === text2.slice(-i)) {
        matchingPartBack = text1.slice(-i);
      } else {
        break;
      }
    }

    return [matchingPartFront, matchingPartBack];
  }

  /**
   * Builds ReadingPairs from the given word and reading, using the specified matching parts.
   *
   * @param {string} matchingPartFront - The matching part at the start.
   * @param {string} matchingPartBack - The matching part at the end.
   * @param {string} word - The word.
   * @param {string} reading - The reading.
   * @returns {ReadingPair[]} An array of ReadingPairs.
   */
  private buildReadingPairs(matchingPartFront: string, matchingPartBack: string, word: string, reading: string): ReadingPair[] {
    const readingPairs: ReadingPair[] = [];

    if (matchingPartFront) {
      readingPairs.push({word: matchingPartFront, reading: null});
    }
    readingPairs.push({
      word: word.slice(matchingPartFront.length, word.length - matchingPartBack.length),
      reading: reading.slice(matchingPartFront.length, reading.length - matchingPartBack.length)
    });
    if (matchingPartBack) {
      readingPairs.push({word: matchingPartBack, reading: null});
    }

    return readingPairs;
  }

}
