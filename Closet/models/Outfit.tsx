import { ClothingItem } from "./ClothingItem";
export class Outfit {
    clothingItems: ClothingItem[];
    collections: string[];
    id: string;
    name: string;

    constructor(id: string, name: string, clothingItems: ClothingItem[], collections: string[]){
        this.id = id;
        this.name = name;
        this.clothingItems = clothingItems;
        this.collections = collections;
    }
} 