let postsCounter = 0;

export class Post {
  id: number;

  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly imageUrl: string,
    public readonly creator: number
  ) {
    this.id = postsCounter;
    postsCounter += 1;
  }
}
