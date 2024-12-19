import { readTextFile } from './utils.mjs';

function checkPossibleDesign(design, patterns) {
  const n = design.length;
  // If length = i can be constructed using the patterns
  const dp = Array(n + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; i++) {
    for (const p of patterns) {
      const len = p.length;

      // check if the last part of design (length i) matches p,
      // and the substring before that match can also be constructed.
      if (i - len >= 0 && design.slice(i - len, i) === p && dp[i - len]) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[n];
}

function getCountOfWays(design, patterns) {
  const n = design.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (const p of patterns) {
      const len = p.length;

      if (i - len >= 0 && design.slice(i - len, i) === p) {
        dp[i] += dp[i - len];
      }
    }
  }

  return dp[n];
}

async function main() {
  const filePath = './day-19-input.txt';
  const fileContent = await readTextFile(filePath);

  const content = fileContent.trim().split('\n\n');
  const patterns = content[0].split(', ');
  const designDisplay = content[1].split('\n');

  // part 1: how many designs are possible
  const possibleDesigns = designDisplay.filter(d => checkPossibleDesign(d, patterns)).length;
  console.log('possible designs number: ', possibleDesigns);

  // part 2: total different ways to construct
  const countOfWays = designDisplay.reduce((acc, d) => acc + getCountOfWays(d, patterns), 0);
  console.log('total count of ways: ', countOfWays);
}

main();