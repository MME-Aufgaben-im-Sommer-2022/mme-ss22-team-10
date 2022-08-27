// Returns a random number of days between 1 and 30
export const generateRandomAscendingArray = (
    size: number,
    minValue: number,
    doRandomlySkipValues = true
  ): Array<string> => {
    const array: Array<string> = [];
    for (let i = 0; i < size; i++) {
      if (doRandomlySkipValues && Math.random() > 0.5) {
        continue;
      }
      array.push(`${minValue + i}`);
    }
    return array;
  },
  // Returns a random lorem ipsum text of the specified length
  generateRandomLoremIpsum = (size: number) => {
    const loremIpsum =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi. Donec euismod, nisi euismod consectetur aliquet, nisi nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.",
      start = Math.floor(Math.random() * (loremIpsum.length - size)),
      end = start + size;

    return loremIpsum.substring(start, end);
  };

// parses date strings like 26.10.2019 to a Date object
export const parseDateFromString = (dateString: string): Date => {
  const dateArray = dateString.split("."),
    day = parseInt(dateArray[0], 10),
    month = parseInt(dateArray[1], 10) - 1,
    year = parseInt(dateArray[2], 10);
  return new Date(year, month, day);
};
