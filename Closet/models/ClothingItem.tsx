export class ClothingItem {
    name: string;
    category: string;
    imageUri: string;
    brand: string;
    size: string;
    color: string;
  
    constructor(name: string, category: string, imageUri: string, brand: string, size: string, color: string) {
      this.name = name;
      this.category = category;
      this.brand = brand;
      this.imageUri = imageUri;
      this.size = size;
      this.color = color;

    }
  
    getFormattedLabel(): string {
      return `${this.category}: ${this.name}`;
    }
    getName(): string {
        return this.name;
    }
    getCategory(): string{
        return this.category;
    }
    getImageUri(): string{
        return this.imageUri;
    }
    getBrand(): string{
        return this.brand;
    }
    getSize(): string{
        return this.size;
    }

    //setters
    setName(name: string) {
        this.name = name;
    }
    setCategory(category: string){
        this.category = category;
    }
    setImageUri(uri: string){
        this.imageUri = uri;
    }
    setBrand(brand: string){
        this.brand = brand;
    }
    setSize(size: string){
        this.size = size;
    }
    setColor(color: string){
        this.color = color;
    }
  }