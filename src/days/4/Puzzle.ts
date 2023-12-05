import { match } from "assert";

type Card = { id: number; winning: number[]; scratched: number[]; }

const readCard = (line: string): Card => {
  const [, id, winning, , scratched] = /Card\s+(\d+):\s+(\d+(\s+\d+)*)\s+\|\s+(\d+(\s+\d+)*)/g.exec(line) || [];
  return {
    id: parseInt(id, 10),
    winning: winning.split(/\s+/).map(Number),
    scratched: scratched.split(/\s+/).map(Number)
  };
}

const matchWinningNumbers = (winning: number[], scratched: number[]): number[] => {
  return scratched.filter(n => winning.includes(n))
}

const first = (input: string) => {
  return input.split('\n')
    .map((line) => {
      let { winning, scratched } = readCard(line)
      let matched = matchWinningNumbers(winning, scratched)
      return (matched.length > 0) ? Math.pow(2, (matched.length - 1)) : 0;
    })
    .reduce((acc, currentValue) => acc + currentValue, 0);
};

const expectedFirstSolution = 'solution 1';

const second = (input: string) => {
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
