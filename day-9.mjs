import { readTextFile } from './utils.mjs';

function getFileBlocks(diskMap, movePlan = 1) {
  let diskLayout = [];
  let fileId = 0;
  for (let i = 0; i < diskMap.length; i++) {
    const length = parseInt(diskMap[i]);
    if (i % 2 === 0) {
      // File length
      for (let j = 0; j < length; j++) {
        diskLayout.push(fileId.toString());
      }
      fileId++;
    } else {
      // Free space
      for (let j = 0; j < length; j++) {
        diskLayout.push('.');
      }
    }
  }

  // Collect file blocks grouped by file IDs
  const fileBlocksMap = new Map();
  for (let i = 0; i < diskLayout.length; i++) {
    const block = diskLayout[i];
    if (block !== '.') {
      if (!fileBlocksMap.has(block)) {
        fileBlocksMap.set(block, []);
      }
      fileBlocksMap.get(block).push(i);
    }
  }

  // Sort file IDs in descending order
  const sortedFileIds = new Map([...fileBlocksMap.entries()].sort((a, b) => b[0] - a[0]));

  if (movePlan === 1) {
    // Collect free positions in order
    const freePositions = [];
    for (let i = 0; i < diskLayout.length; i++) {
      if (diskLayout[i] === '.') {
        freePositions.push(i);
      }
    }

    // Assign file blocks from highest ID to lowest ID to '.' positions
    let freeIndex = 0;
    for (const id of sortedFileIds.keys()) {
      const blocks = sortedFileIds.get(id);
      for (let j = blocks.length - 1; j >= 0; j--) {
        if (freeIndex >= freePositions.length || blocks[j] <= freePositions[freeIndex]) {
          break;
        }
        diskLayout[freePositions[freeIndex++]] = id;
        diskLayout[blocks[j]] = '.';
      }
    }

    return diskLayout;
  }

  // part 1 ends here
  // =============================

  function findLeftmostFreeSpan([fileStart, fileEnd]) {
    const fileLength = fileEnd - fileStart + 1;
    const freeSpans = [];
    let current = 0;

    while (current < diskLayout.length) {
      if (diskLayout[current] === '.') {
        let spanStart = current;
        while (current < diskLayout.length && diskLayout[current] === '.') {
          current++;
        }
        let spanEnd = current - 1;
        freeSpans.push({ start: spanStart, end: spanEnd, length: spanEnd - spanStart + 1 });
      } else {
        current++;
      }
    }
    
    for (const span of freeSpans) {
      if (span.length >= fileLength && span.end < fileStart) {
        return span;
      }
    }
    return null;
  }

  // Move files
  for (const fileId of sortedFileIds.keys()) {
    const files = sortedFileIds.get(fileId);
    const fileStart = files[0];
    const fileEnd = files[files.length - 1];
    const freeSpan = findLeftmostFreeSpan([fileStart, fileEnd]);

    if (freeSpan) {
      for (let i = freeSpan.start; i < freeSpan.start + files.length; i++) {
        diskLayout[i] = fileId;
      }
      for (let i = fileStart; i < fileStart + files.length; i++) {
        diskLayout[i] = '.';
      }
    }
  }

  return diskLayout;
}

function calChecksum(diskLayout) {
  let checksum = 0;
  for (let i = 0; i < diskLayout.length; i++) {
    if (diskLayout[i] === '.') {
      continue;
    }
    checksum += i * Number(diskLayout[i]);
  }
  return checksum;
}

async function main() {
  const filePath = './day-9-input.txt';
  const fileContent = await readTextFile(filePath);

  // part 1: checksum result by moving single block
  const moveSigleLayout = getFileBlocks(fileContent, 1);
  console.log("checksum by moving single block: ", calChecksum(moveSigleLayout));

  // part 2: checksum result by moving whole files
  const moveWholeLayout = getFileBlocks(fileContent, 2);
  console.log("checksum by moving whole files: ", calChecksum(moveWholeLayout));
}

main();