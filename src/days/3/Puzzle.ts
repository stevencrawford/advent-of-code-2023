type SpecialChar =
    '!'
    | '@'
    | '#'
    | '$'
    | '%'
    | '^'
    | '&'
    | '*'
    | '('
    | ')'
    | '_'
    | '+'
    | '-'
    | '='
    | '['
    | ']'
    | '{'
    | '}'
    | '\\'
    | '|'
    | ';'
    | ':'
    | '\''
    | '"'
    | ','
    | '<'
    | '>'
    | '/'
    | '?';
type Indexed = { startIndex: number; endIndex: number }
type IndexedAny = { value: number | SpecialChar } & Indexed
type IndexedNumber = { value: number } & Indexed
type IndexedSymbol = { value: SpecialChar } & Indexed
type IndexedLine = { line: number; numbers: IndexedNumber[]; symbols: IndexedSymbol[] }

const NUM_BUFFER = 1;
const SYMBOL_BUFFER = 0;

const numberRegex: RegExp = /\d+/g;
const symbolRegex: RegExp = /[^0-9.]/g; // not a digit or a period

type Processor<T> = (value: string) => T;

const numberProcessor: Processor<number> = (value: string) => parseInt(value, 10);
const symbolProcessor: Processor<SpecialChar> = (value: string) => value as SpecialChar;

const extractValues = (text: string, pattern: RegExp, buffer: number, processor: Processor<number | SpecialChar>): IndexedAny[] | IndexedSymbol[] => {
    const result: IndexedAny[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
        const [fullMatch] = match;
        const startIndex = Math.max(match.index - buffer, 0);
        const endIndex = Math.min(((startIndex == 0) ? startIndex - 1 : startIndex) + fullMatch.length + buffer, text.length);

        result.push({ value: processor(fullMatch), startIndex, endIndex });
    }
    return result;
};

const findAdjacentWithSymbol = (numbers: IndexedNumber[], symbols: IndexedSymbol[]): IndexedNumber[] => {
    return numbers.filter(number => symbols.some(_symbol => _symbol.startIndex >= number.startIndex && _symbol.startIndex <= number.endIndex));
};

const first = (input: string) => {
    const indexedLines: IndexedLine[] = [];
    input.split('\n')
        .map((line, index) => {
            const indexedLine = {
                line: index + 1,
                numbers: extractValues(line, numberRegex, NUM_BUFFER, numberProcessor) as IndexedNumber[],
                symbols: extractValues(line, symbolRegex, SYMBOL_BUFFER, symbolProcessor) as IndexedSymbol[]
            };
            indexedLines.push(indexedLine);
        });

    const partNumbers: IndexedNumber[] = [];
    indexedLines.forEach((line, index, lines) => {
        const adjacent: IndexedNumber[] = [];
        // check for collisions on the line above (if not at first line)
        if (index - 1 >= 0) {
            adjacent.push(...findAdjacentWithSymbol(line.numbers, lines[index - 1].symbols));
        }
        // check for collisions on the same line
        adjacent.push(...findAdjacentWithSymbol(line.numbers, line.symbols));
        // check for collisions with the line below (if not already at last line)
        if (index + 1 < lines.length) {
            adjacent.push(...findAdjacentWithSymbol(line.numbers, lines[index + 1].symbols));
        }
        // remove duplicates where number has more than 1 symbol adjacent to it
        partNumbers.push(...Array.from(new Map(adjacent.map(c => [`${c.value}|${c.startIndex}|${c.endIndex}`, c])).values()));
    });

    return partNumbers.reduce((accumulator, current) => accumulator + current.value, 0);
};

const expectedFirstSolution = 'solution 1';

const second = (input: string) => {
    return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
