type StringNumber = [string, number];

type StringNumberWithMinMaxIndexes = [StringNumber, [number, number]];

const numbers: StringNumber[] = [['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9]];
const words: StringNumber[] = [['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5], ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9]];
const numbersAndWords: StringNumber[] = [...numbers, ...words];

const minComparator = (a: StringNumberWithMinMaxIndexes, b: StringNumberWithMinMaxIndexes) => a[1][0] - b[1][0];
const maxComparator = (a: StringNumberWithMinMaxIndexes, b: StringNumberWithMinMaxIndexes) => a[1][1] - b[1][1];

const first = (input: string) => {
  return calculate(input, numbers);
};

const expectedFirstSolution = 54597;

const second = (input: string) => {
  return calculate(input, numbersAndWords);
};

const expectedSecondSolution = 54504;

const calculate = (input: string, numbersToFind: StringNumber[]) => {
  return input.split('\n')
    .map((line) => {
      let digitsWithIndexes: StringNumberWithMinMaxIndexes[] = numbersToFind
        .map(([digit, _number]): StringNumberWithMinMaxIndexes => [[digit, _number], [line.indexOf(digit), line.lastIndexOf(digit)]])
        .filter(([_, [min, max]]) => min > -1 && max > -1);

      return digitsWithIndexes
        .reduce((acc, current) => {
          acc[0] = minComparator(acc[0], current) < 0 ? acc[0] : current;
          acc[1] = maxComparator(acc[1], current) > 0 ? acc[1] : current;
          return acc;
        }, [digitsWithIndexes[0], digitsWithIndexes[0]])
        .reduce((acc, [digitAsStrings, index]) => 10 * (acc) + digitAsStrings[1], 0)
        ;
    })
    .reduce((acc, currentValue) => acc + currentValue, 0);
}

export { first, expectedFirstSolution, second, expectedSecondSolution };
