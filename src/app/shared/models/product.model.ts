export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public description: string,
    public image: string,
    public featured: boolean,
    public stock: number,
    public rating: { rate: number; count: number }
  ) {}
}
