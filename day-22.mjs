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
}

main();