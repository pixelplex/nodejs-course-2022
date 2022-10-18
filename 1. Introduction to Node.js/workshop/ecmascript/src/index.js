import readline from 'readline-sync';
import * as cat from './cat.js';
import { voice as catVoice } from './cat.js';
import { Dog } from './dog.js';

const n = readline.questionInt('Enter positive number\n');
console.log(`Cat says ${cat.voice(n)}`);
console.log(`Cat says ${catVoice(n)}`);

const myDog = new Dog('Rex');
myDog.greeting();
console.log(`Dog says ${myDog.voice(n)}`);
