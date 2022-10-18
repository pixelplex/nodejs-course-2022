//'use strict';

const cat = require('./cat.js');
const Dog = require('./dog.js');
const readline = require('readline-sync');

const n = readline.questionInt('Enter positive number\n');
// local vars are private
console.log(cat.MEOW);

console.log(`Cat says ${cat.voice(n)}`);

const myDog = new Dog('Rex');
myDog.greeting();
console.log(`Dog says ${myDog.voice(n)}`);
