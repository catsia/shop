export class Review {
  constructor(
    public id: number,
    public productId: number,
    public name: string,
    public rate: number,
    public text: string
  ) {}
}
