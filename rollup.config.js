import typescript from 'rollup-plugin-typescript2';

// const PATH = 'dist/main.js';
// const PATH = 'C:\\Users\\jxd9612_191772653294\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default\\main.js';
// const PATH = 'C:\\Users\\jxd9612_191772653294\\AppData\\Local\\Screeps\\scripts\\screeps.com\\tutorial-1\\main.js';
// const PATH = 'C:\\Users\\jxd\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default\\main.js';
const PATH = 'C:\\Users\\11009852\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default\\main.js';

export default {
  input: 'src/main.ts',
  output: {
    file: PATH,
    format: 'cjs',
  },
  plugins: [typescript()],
};
