import { readTextFile } from './utils.mjs';

function hasIntersection(setA, setB) {
  const set2 = new Set(setB);
  return setA.some(element => set2.has(element));
}

function swap(nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}

function checkListValid(list, ruleMap) {
  for (let i = 0; i < list.length; i++) {
    const num = list[i];
    if (ruleMap.has(num)) {
      const numsShouldBeforeNum = ruleMap.get(num);
      // check if there is any intersection between 
      // <nums must present before num> and <nums actually present after num>
      if (hasIntersection(numsShouldBeforeNum, list.slice(i + 1))) {
        return false;
      }
    }
  }

  return true;
}

function checkAndMoveToValid(list, ruleMap) {
  // flag represents whether the list needs to do swap
  list.flag = false;

  for (let i = 0; i < list.length; i++) {
    const num = list[i];

    if (ruleMap.has(num)) {
      const numsShouldBeforeNumSet = new Set(ruleMap.get(num));
      for (let j = i + 1; j < list.length; j++) {
        if (numsShouldBeforeNumSet.has(list[j])) {
          swap(list, i, j);
          list.flag = true;

          /* 
            Reset i to -1 to ensure that the entire list is re-evaluated after a swap.
            This is crucial because a swap at an earlier position can affect 
            the order of elements that have already been processed.
          */ 
          i = -1; 
          break;
        }
      }
    }
  }
}

async function main() {
  const filePath = './day-5-input.txt';
  const fileContent = await readTextFile(filePath);

  let [rules, lists] = fileContent.trim().split('\n\n');
  rules = rules.trim().split('\n').map(r => r.split('|')).map(r => r.map(Number));
  lists = lists.trim().split('\n').map(l => l.split(',')).map(l => l.map(Number));

  // Map<num, nums must present before num>
  const ruleOrderMap = new Map();
  rules.forEach(r => {
    const [left, right] = r;
    if (ruleOrderMap.has(right)) {
      ruleOrderMap.get(right).push(left);
    } else {
      ruleOrderMap.set(right, [left]);
    }
  })

  // part 1: total middle number of valid list
  const validLists = lists.filter(l => checkListValid(l, ruleOrderMap));
  const totalMiddleNum = validLists.reduce((acc, l) => {
    const middleNum = l[(l.length - 1) / 2];
    return acc + middleNum;
  }, 0);

  console.log("totalMiddleNum result: ", totalMiddleNum);

  // part 2: total middle number of invalid list after swap
  let totalMidAfterSwap = 0;
  lists.forEach(l => {
    checkAndMoveToValid(l, ruleOrderMap);

    if (l.flag) {
      totalMidAfterSwap += l[(l.length - 1) / 2];
    }
  });
 
  console.log("totalMidAfterSwap result: ", totalMidAfterSwap);
}

main();