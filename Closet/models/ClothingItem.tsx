export class ClothingItem {
    name: string;
    category: string;
    imageUri: string;
  
    constructor(name: string, category: string, imageUri: string) {
      this.name = name;
      this.category = category;
      this.imageUri = imageUri;
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
        return this.category;
    }
  }