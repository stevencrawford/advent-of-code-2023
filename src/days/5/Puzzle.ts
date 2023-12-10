type Category = 'seed' | 'soil' | 'fertilizer' | 'water' | 'light' | 'temperature' | 'humidity' | 'location'
type Range = { source: number; destination: number; len: number }
type Mapping = { source: Category; destination: Category; ranges: Range[] }

const readSeeds = (almanac: string): number[] => {
    const [, seedsStr] = /seeds: ((\d+\s?)+)/g.exec(almanac) || [];
    return seedsStr.split(' ').map(Number);
};

const readSeedsAsRange = (almanac: string): number[] => {
    const firstLine = almanac.split('\n')[0];
    const matches = [...firstLine.matchAll(/\b(\d+)\s+(\d+)\b/g)];
    return matches.map(match => [parseInt(match[1], 10), parseInt(match[2], 10)])
        .flatMap(([start, length]) => {
            return Array.from({ length }, (_, index) => start + index);
        });
};

const readMapping = (input: string, source: Category, destination: Category): Mapping => {
    const mapping: Mapping = {
        source,
        destination,
        ranges: []
    };
    const [, rangeStr] = new RegExp(`${source}-to-${destination} map:\n((\\d+\\s?)+)(\n)?`, 'g').exec(input) || [];
    rangeStr.split('\n').forEach((line) => {
        const parts = line.split(' ');
        if (parts && parts.length == 3) {
            mapping.ranges.push({
                source: parseInt(parts[1], 10),
                destination: parseInt(parts[0], 10),
                len: parseInt(parts[2], 10),
            });
        }
    });
    return mapping;
};

const findDestinationValue = (almanac: string, source: Category, destination: Category, srcValue: number): number => {
    const mapping = readMapping(almanac, source, destination);
    let result = srcValue;
    mapping.ranges.forEach(r => {
        if (result == srcValue
            && (srcValue >= r.source && srcValue < (r.source + r.len))) {
            result = r.destination + (srcValue - r.source);
        }
    });
    return result;
};

const findMinLocation = (almanac: string, seeds: number[]) => {
    const locations = seeds.map(seed => {
        const soil = findDestinationValue(almanac, 'seed', 'soil', seed);
        const fertilizer = findDestinationValue(almanac, 'soil', 'fertilizer', soil);
        const water = findDestinationValue(almanac, 'fertilizer', 'water', fertilizer);
        const light = findDestinationValue(almanac, 'water', 'light', water);
        const temperature = findDestinationValue(almanac, 'light', 'temperature', light);
        const humidity = findDestinationValue(almanac, 'temperature', 'humidity', temperature);
        return findDestinationValue(almanac, 'humidity', 'location', humidity);
    });
    return Math.min(...locations);
};

const first = (input: string) => {
    const seeds = readSeeds(input);
    return findMinLocation(input, seeds);
};

const expectedFirstSolution = 662197086;

const second = (input: string) => {
    const seeds = readSeedsAsRange(input);
    return findMinLocation(input, seeds);
};

const expectedSecondSolution = 'solution 2';

export { first, expectedFirstSolution, second, expectedSecondSolution };
