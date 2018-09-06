const SULFURAS: string = 'Sulfuras'
const AGED_BRIE: string = 'Aged Brie'
const BACKSTAGE_PASSES: string = 'Backstage Passes'
const CONJURED: string = 'Conjured'


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
            if (element.name != AGED_BRIE && element.name != BACKSTAGE_PASSES ) {
                if (element.quality > 0) {
                    if (element.name != SULFURAS) {
                        if (element.name == CONJURED && element.quality > 1) {
                            element.quality = element.quality - 2
                        }
                        else {
                            element.quality = element.quality - 1
                        }
                    }
                }
            } else {
                if (element.quality < 50) {
                    element.quality = element.quality + 1
                    if (element.name == BACKSTAGE_PASSES) {
                        if (element.sellIn < 11) {
                            if (element.quality < 50) {
                                element.quality = element.quality + 1
                            }
                        }
                        if (element.sellIn < 6) {
                            if (element.quality < 50) {
                                element.quality = element.quality + 1
                            }
                        }
                    }
                }
            }
            if (element.name != SULFURAS) {
                element.sellIn = element.sellIn - 1;
            }
            if (element.sellIn < 0) {
                if (element.name != AGED_BRIE) {
                    if (element.name != BACKSTAGE_PASSES) {
                        if (element.quality > 0) {
                            if (element.name != SULFURAS) { 
                                if (element.name == CONJURED) {
                                    element.quality = element.quality - 2
                                }
                                else {
                                    element.quality = element.quality - 1
                                }
                            }
                        }
                    } else {
                        element.quality = element.quality - element.quality
                    }
                } else {
                    if (element.quality < 50) {
                        element.quality = element.quality + 1
                    }
                }
            }
        });

        return this.items;
    }
}
