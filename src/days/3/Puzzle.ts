type Symbol = "!" | "@" | "#" | "$" | "%" | "^" | "&" | "*" | "(" | ")" | "_" | "+" | "-" | "=" | "[" | "]" | "{" | "}" | "\\" | "|" | ";" | ":" | "'" | "\"" | "," | "<" | ">" | "/" | "?";
type IndexedValue = { value: number | Symbol; startIndex: number; endIndex: number }
type IndexedLine = { numbers: IndexedValue[]; symbols: IndexedValue[] }

const NUM_BUFFER = 1;
const SYMBOL_BUFFER = 0;

const numberRegex: RegExp = /\d+/g;
const symbolRegex: RegExp = /[!@#$%^&*()_+\-=\[\]{}\\|;:'",<>\/?]/g;

type Processor<T> = (value: string) => T;

const numberProcessor: Processor<number> = (value: string) => parseInt(value, 10);
const symbolProcessor: Processor<Symbol> = (value: string) => value as Symbol;

const extractValues = (text: string, pattern: RegExp, buffer: number, processor: Processor<number | Symbol>): IndexedValue[] => {
  let result: IndexedValue[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const [fullMatch] = match;
    const startIndex = Math.max(match.index - buffer, 0);
    const endIndex = Math.min((startIndex + (fullMatch.length - 1)) + 2 * buffer, text.length);

    result.push({ value: processor(fullMatch), startIndex, endIndex });
  }
  return result;
}

const findCollisions = (numbers: IndexedValue[], symbols: IndexedValue[]): IndexedValue[] => {
  return numbers.filter(number => symbols.some(_symbol => _symbol.startIndex >= number.startIndex && _symbol.endIndex <= number.endIndex));
}

const first = (input: string) => {
  const indexedLines: IndexedLine[] = [];
  input.split('\n')
    .map((line) => {
      let indexedLine = {
        numbers: extractValues(line, numberRegex, NUM_BUFFER, numberProcessor),
        symbols: extractValues(line, symbolRegex, SYMBOL_BUFFER, symbolProcessor)
      }
      indexedLines.push(indexedLine);
    })

  let collisions: IndexedValue[] = []
  indexedLines.forEach((line, index, lines) => {
    // check for collisions on the line above (if not at first line)
    if (index - 1 >= 0) {
      // console.log(original[index - 1])
      collisions.push(...findCollisions(line.numbers, lines[index - 1].symbols))
    }
    // check for collisions on the same line
    collisions.push(...findCollisions(line.numbers, line.symbols))
    // check for collisions with the line below (if not already at last line)
    if (index + 1 < lines.length) {
      collisions.push(...findCollisions(line.numbers, lines[index + 1].symbols))
    }
  })

  return collisions.reduce((accumulator, current) => accumulator + (current.value as number), 0);
};

const expectedFirstSolution = 'solution 1';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
