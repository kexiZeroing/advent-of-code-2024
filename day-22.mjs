import { readTextFile } from './utils.mjs';

// If the result of the XOR produces a value outside JS integer range, 
// it will "wrap around" due to overflow, resulting in a negative value.
// So below function is not correct for large numbers.
// function getNextSecret(num) {
//   const step1 = (num ^ (num * 64)) % 16777216;
//   const step2 = (step1 ^ Math.floor(step1 / 32)) % 16777216;
//   const step3 = (step2 ^ (step2 * 2048)) % 16777216;
//   return step3;
// }

function mixPrune(val, num) {
  return (val ^ num) % 16777216n;
}

function getNextSecret(num) {
  num = mixPrune(num << 6n, num);  // num * 64
  num = mixPrune(num >> 5n, num);  // num / 32
  num = mixPrune(num << 11n, num); // num * 2048

  return num;
}

async function main() {
  const filePath = './day-22-input.txt';
  const fileContent = await readTextFile(filePath);

  const secrets = fileContent.trim().split('\n').map(Number);

  // part 1: sum of the 2000th secret number generated
  const secretsAfter2000th = secrets.map(s => {
    s = BigInt(s);
    for (let i = 0; i < 2000; i++) {
      s = getNextSecret(s);
    }
    return s;
  });

  const sum = secretsAfter2000th.reduce((acc, s) => acc + Number(s), 0);
  console.log('sum of the 2000th secret number:', sum);

  // part 2: most bananas you can get (sum of same squence's start position)
  const seqStartMap = new Map();

  for (let s of secrets) {
    s = BigInt(s);
    const changeSeqMap = new Map();
    const fourConsecutiveChanges = [];
    let prevOnesDigit = s % 10n;
    let onesDigit;

    for (let i = 0; i < 2000; i++) {
      s = getNextSecret(s);
      onesDigit = s % 10n;
      fourConsecutiveChanges.push(onesDigit - prevOnesDigit);

      if (fourConsecutiveChanges.length === 4) {
        const mapKey = fourConsecutiveChanges.join(',');
        if (!changeSeqMap.has(mapKey)) {
          changeSeqMap.set(mapKey, onesDigit);
        }
        fourConsecutiveChanges.shift();
      }
      
      prevOnesDigit = onesDigit;
    }

    // put the same key together
    for (let [key, value] of changeSeqMap.entries()) {
      seqStartMap.set(key, (seqStartMap.get(key) ?? 0) + Number(value));
    }
  }
  
  const maxBananas = Math.max(...seqStartMap.values());
  console.log('most bananas you can get:', maxBananas);
}

main();