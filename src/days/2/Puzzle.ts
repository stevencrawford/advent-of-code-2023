type Cubes = Record<'red' | 'blue' | 'green', number>
type Turn = Cubes
type Game = { id: number; turns: Turn[] }
type PossibleGame = Game & { possible: boolean }
type PowerGame = Game & { minNecessary: Cubes, power: number }

const extractColorFromTurn = (turn: string, color: 'red' | 'blue' | 'green'): number => {
    const [, count] = new RegExp(`(\\d+)\\s+${color}`, 'g').exec(turn) || [];
    if (count) {
        return parseInt(count);
    }
    return 0;
};

const processTurn = (turn: string): Turn => {
    return {
        red: extractColorFromTurn(turn, 'red'),
        green: extractColorFromTurn(turn, 'green'),
        blue: extractColorFromTurn(turn, 'blue'),
    };
};

const first = (input: string) => {
    // only 12 red cubes, 13 green cubes, and 14 blue cubes
    const [MAX_RED, MAX_GREEN, MAX_BLUE] = [12, 13, 14];

    const possibleGames: Game[] = [];
    input.split('\n')
        .map((line) => {
            // initialize empty game
            const game: PossibleGame = {
                id: parseInt(/Game (\d+):/.exec(line)[1], 10),
                turns: [],
                possible: true
            };
            // extract each turn
            line.split(';')
                .map((t) => {
                    const turn = processTurn(t);
                    game.turns.push(turn);
                    game.possible = game.possible && turn.red <= MAX_RED && turn.green <= MAX_GREEN && turn.blue <= MAX_BLUE;
                });

            // add game to array of games if less that MAX
            if (game.possible) {
                possibleGames.push(game);
            }

        });

    // add up the game IDs and return
    return possibleGames.reduce((accumulator, current) => accumulator + current.id, 0);
};

const expectedFirstSolution = 2085;

const second = (input: string) => {
    const ZERO: Cubes = {
        red: 0,
        green: 0,
        blue: 0
    };

    const games: PowerGame[] = [];
    input.split('\n')
        .map((line) => {
            // initialize empty game
            const game: PowerGame = {
                id: parseInt(/Game (\d+):/.exec(line)[1], 10),
                turns: [],
                minNecessary: ZERO, // initial
                power: 0,
            };
            // extract each turn
            line.split(';')
                .map((turn) => {
                    game.turns.push(processTurn(turn));
                });

            // calculate minumum necessary
            game.minNecessary = game.turns.reduce((maximum, current) => {
                maximum.red = Math.max(maximum.red, current.red);
                maximum.green = Math.max(maximum.green, current.green);
                maximum.blue = Math.max(maximum.blue, current.blue);
                return maximum;
            }, { red: 0, green: 0, blue: 0 });

            // calculate power based on minimum red * green * blue
            game.power = game.minNecessary.red * game.minNecessary.green * game.minNecessary.blue;

            games.push(game);
        });

    return games.reduce((accumulator, current) => accumulator + current.power, 0);
};

const expectedSecondSolution = 79315;

export { first, expectedFirstSolution, second, expectedSecondSolution };
