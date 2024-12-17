import { readTextFile } from './utils.mjs';

const combo = (num, register) => {
  if (num >= 0 && num <= 3) {
    return num;
  }
  else if (num === 4) {
    return register.a;
  }
  else if (num === 5) {
    return register.b;
  }
  else if (num === 6) {
    return register.c;
  }
}

const opcodes = [
  'adv',
  'bxl',
  'bst',
  'jnz',
  'bxc',
  'out',
  'bdv',
  'cdv',
]

const instructions = {
  'adv': (register, operand) => {
    const numerator = register.a;
    const denominator = 2 ** combo(operand, register);
    register.a = Math.floor(numerator / denominator);
    return {
      jump: null,
      output: null
    };
  },
  'bxl': (register, operand) => {
    // xor
    register.b = register.b ^ operand;
    return {
      jump: null,
      output: null
    };
  },
  'bst': (register, operand) => {
    register.b = combo(operand, register) % 8;
    return {
      jump: null,
      output: null
    };
  },
  'jnz': (register, operand) => {
    if (register.a === 0) {
      return {
        jump: null,
        output: null
      };
    } 
    return {
      jump: operand,
      output: null
    };
  },
  'bxc': (register, operand) => {
    register.b = register.b ^ register.c;
    return {
      jump: null,
      output: null
    };
  },
  'out': (register, operand) => {
    return {
      jump: null,
      output: combo(operand, register) % 8
    };
  },
  'bdv': (register, operand) => {
    const numerator = register.a;
    const denominator = 2 ** combo(operand, register);
    register.b = Math.floor(numerator / denominator);
    return {
      jump: null,
      output: null
    };
  },
  'cdv': (register, operand) => {
    const numerator = register.a;
    const denominator = 2 ** combo(operand, register);
    register.c = Math.floor(numerator / denominator);
    return {
      jump: null,
      output: null
    };
  },
}

function run(program, registers) {
  const result = [];
  for (let i = 0; i < program.length; i = i + 2) {
    const opcode = opcodes[program[i]];
    const operand = program[i + 1];
    const { jump, output } = instructions[opcode](registers, operand);
    if (jump !== null) {
      i = jump - 2;
    }
    if (output !== null) {
      result.push(output);
    }
  }

  return result.join(',');
}

async function main() {
  const filePath = './day-17-input.txt';
  const fileContent = await readTextFile(filePath);

  const content = fileContent.trim().split('\n\n');
  const registers = content[0].match(/\d+/g).map(Number);
  const registerMap = {
    'a': registers[0],
    'b': registers[1],
    'c': registers[2],
  };
  const program = content[1].match(/\d/g).map(Number);

  // part 1: what the program is trying to output
  const outputString = run(program, registerMap);
  console.log('output into a single string: ', outputString);

  // brute force not work, need to find patterns in the output...
  // const programString = program.join(',');
  // let i = 1;
  // while (true) {
  //   registerMap['a'] = i;
  //   const result = run(program, registerMap);

  //   if (result === programString) {
  //     return i;
  //   }
  //   i++;
  // }
}

main();