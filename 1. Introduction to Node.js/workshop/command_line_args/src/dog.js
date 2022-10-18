const WOOF = 'woof';

export class Dog {
  constructor(name) {
    this.name = name;
  }

  greeting() {
    console.log(`Hi! My name is ${this.name}`);
  }

  voice(n) {
    return `"${Array(n).fill(WOOF).join(' ')}"`;
  }
}
