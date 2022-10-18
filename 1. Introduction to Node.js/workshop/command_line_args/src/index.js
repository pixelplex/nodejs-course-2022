// import { Dog } from './dog.js';

// // Name and number of "woofs" are taken from command line args
// const args = process.argv.slice(2);

// if (args.length < 2) {
//     console.error('Requires at least two arguments!');
//     process.exit(1);
// }

// console.log(args);

// const nameArg = args.find((el) => (new RegExp(/^name=/)).test(el));
// if (!nameArg) {
//     console.error('Requires "name" argument!');
//     process.exit(1);
// }

// const repeatCountArg = args.find((el) => (new RegExp(/^repeat_count=/)).test(el));
// if (!repeatCountArg) {
//     console.error('Requires "repeat_count" argument!');
//     process.exit(1);
// }

// const name = nameArg.replace('name=', '');
// const repeatCount = +(repeatCountArg.replace('repeat_count=', ''));

// const myDog = new Dog(name);
// myDog.greeting();
// console.log(`Dog says ${myDog.voice(repeatCount)}`);



import { program } from 'commander';
import { Dog } from './dog.js';

program
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-n, --name <value>', 'Dog\'s name.')
  .option('-rc, --repeat_count <value>', 'Number of "woofs".', 1)
  .parse(process.argv);

const options = program.opts();

const myDog = new Dog(options.name);
myDog.greeting();
console.log(`Dog says ${myDog.voice(+options.repeat_count)}`);
