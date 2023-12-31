type Card = { id: number; winning: number[]; scratched: number[]; }

const readCard = (line: string): Card => {
    const [, id, winning, , scratched] = /Card\s+(\d+):\s+(\d+(\s+\d+)*)\s+\|\s+(\d+(\s+\d+)*)/g.exec(line) || [];
    return {
        id: parseInt(id, 10),
        winning: winning.split(/\s+/).map(Number),
        scratched: scratched.split(/\s+/).map(Number)
    };
};

const matchWinningNumbers = (winning: number[], scratched: number[]): number[] => {
    return scratched.filter(n => winning.includes(n));
};

const first = (input: string) => {
    return input.split('\n')
        .map((line) => {
            const { winning, scratched } = readCard(line);
            const matched = matchWinningNumbers(winning, scratched);
            return (matched.length > 0) ? Math.pow(2, (matched.length - 1)) : 0;
        })
        .reduce((acc, currentValue) => acc + currentValue, 0);
};

const expectedFirstSolution = 19855;

const second = (input: string) => {

    const cards: Card[][] = [];
    const initializedCards = (index: number): Card[][] => {
        if (!cards[index]) {
            cards[index] = [];
        }
        return cards;
    };

    const lines = input.split('\n');
    lines.map((line) => {
        const current = readCard(line);
        initializedCards(current.id)[current.id].push(current);
        const cardCount = cards[current.id].length;

        const matches = matchWinningNumbers(current.winning, current.scratched).length;
        Array.from({ length: matches },
            (_, count) => {
                const nextCardId = current.id + (count + 1);
                if (nextCardId - 1 < lines.length) {
                    const nextCard = readCard(lines[nextCardId - 1]);
                    Array.from({ length: cardCount }, () => initializedCards(nextCardId)[nextCardId].push(nextCard));
                }
            });
    });

    return cards.reduce((accumulator, current) => accumulator + current.length, 0);
};

const expectedSecondSolution = 10378710;

export { first, expectedFirstSolution, second, expectedSecondSolution };
