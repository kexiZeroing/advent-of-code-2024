import { readTextFile } from './utils.mjs';

const operationMap = new Map([
  ['AND', (a, b) => a & b],
  ['OR', (a, b) => a | b],
  ['XOR', (a, b) => a ^ b],
]);

function getZWires(opList, wiresMap) {
  const total = opList.length;
  let done = 0;

  while (done < total) {
    for (let i = 0; i < opList.length; i++) {
      const { a, op, b, c } = opList[i];

      if (!wiresMap.has(a) || !wiresMap.has(b)) {
        continue;
      }

      const result = operationMap.get(op)(wiresMap.get(a), wiresMap.get(b));
      wiresMap.set(c, result);
      opList.splice(i, 1);

      done++;
      i--;
    }
  }

  // wires that start with 'z' and sorted
  const zWiresKey = Array.from(wiresMap.keys()).filter(k => k.startsWith('z'));
  return zWiresKey.sort().map(zKey => wiresMap.get(zKey));
}

async function main() {
  const filePath = './day-24-input.txt';
  const fileContent = await readTextFile(filePath);

  const content = fileContent.trim().split('\n\n');
  const startedWiresMap = new Map();
  
  content[0].split('\n').forEach(line => {
    const [wire, val] = line.trim().split(': ');
    startedWiresMap.set(wire, Number(val));
  });

  const opList = content[1].split('\n').map(line => {
    const [a, op, b, , c] = line.trim().split(' ');
    return { a, op, b, c };
  })

  // part 1: decimal number constructed from the wires starting with z
  const zWiresVal = getZWires(opList, startedWiresMap);
  let decimalNum = 0;
  for (let i = 0; i < zWiresVal.length; i++) {
    decimalNum += zWiresVal[i] * (Math.pow(2, i));
  }
  console.log('output decimal number: ', decimalNum);
}

main();