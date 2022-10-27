let userCounter = 0;

export class User {
  id: number;

  constructor(public readonly email: string, public readonly password: string, public readonly name: string) {
    this.id = userCounter;
    userCounter += 1;
  }
}
