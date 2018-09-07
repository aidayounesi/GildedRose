function sellInHasPassed(sellIn: number): boolean {
    return sellIn < 1;
}
function sellInHasNotPassed(sellIn: number): boolean {
    return !sellInHasPassed(sellIn);
}    
function sellInMoreThan10(sellIn: number): boolean {
    return sellIn > 10;
}
function sellInMoreThan5LessE10(sellIn: number): boolean {
    return sellIn <= 10 && sellIn > 5;
}
function sellInLessE5NotPassed(sellIn: number): boolean {
    return sellIn <= 5 && sellIn >= 1;
}

const RULES: { [id: string]: Array<[(sellIn: number) => boolean, number]>} = {
    'Sulfuras': [
        [() => true, 0]
    ],
    'Aged Brie': [
        [sellInHasNotPassed, +1], 
        [sellInHasPassed, +2]
    ],
    'Backstage Passes': [
        [sellInMoreThan10, +1], 
        [sellInMoreThan5LessE10, +2], 
        [sellInLessE5NotPassed, +3], 
        [sellInHasPassed, Number.NEGATIVE_INFINITY]
    ],
    'Conjured': [
        [sellInHasNotPassed, -2], 
        [sellInHasPassed, -4]
    ],
    'Default': [
        [sellInHasNotPassed, -1], 
        [sellInHasPassed, -2]
    ]
};

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}
export class GildedRose {
    items: Array<Item>;

   
    constructor(items = []) {
        this.items = items;
    }

    updateQuality() {
        this.items.forEach(element => {
            (RULES[element.name] || RULES['Default']).forEach( rule => {
                if (rule[0](element.sellIn)) {
                    element.quality += rule[1];
                    console.log(element.quality);
                }
            });
            element.quality = Math.min(50, element.quality);
            element.quality = Math.max(0, element.quality);

            if (element.name != 'Sulfuras')
                element.sellIn -= 1;
        });
        return this.items;
    }
}