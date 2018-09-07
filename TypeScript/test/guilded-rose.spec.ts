import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

const itParam = require('mocha-param').itParam

const assertQualityAsExpected = ((itemName, initialSellIn, initialQuality, expectedUpdatedQuality) => {
    let backStagePasses = new GildedRose([new Item(itemName, initialSellIn, initialQuality)]);
    const items = backStagePasses.updateQuality(); 
    expect(items[0].quality).to.equal(expectedUpdatedQuality);
});

describe('Gilded Rose - Basics', function () {
        it('All items have a SellIn value as a number', () =>{
        const gildedRose = new GildedRose([new Item('basic', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(typeof items[0].sellIn).to.equal("number");
    });

    it('All items have a Quality value as a number', () =>{
        const gildedRose = new GildedRose([new Item('basic', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(typeof items[0].quality).to.equal("number");
    });
    
    it('Empty items of gilded rose', () =>{
        const gildedRose = new GildedRose();
        expect(gildedRose.updateQuality()).to.be.empty;
    });
});

describe('Gilded Rose - General', ()=> {
    const types = ['Sulfuras', 'Aged Brie', 'Conjured', 'Backstage passes', 'normal']

    const assertQualityAboveZero = ((itemName, initialSellIn, initialQuality) => {
        let backStagePasses = new GildedRose([new Item(itemName, initialSellIn, initialQuality)]);
        const items = backStagePasses.updateQuality(); 
        expect(items[0].quality).to.not.below(0);
    });

    const assertQualityBelowFifty = ((itemName, initialSellIn, initialQuality) => {
        let backStagePasses = new GildedRose([new Item(itemName, initialSellIn, initialQuality)]);
        const items = backStagePasses.updateQuality(); 
        expect(items[0].quality).to.not.above(50);
    });

    itParam("The Quality of ${value} is never negative, when Quality is 0 initially", types, (value) => {
        assertQualityAboveZero(value, 1, 0);
    });

    itParam("The Quality of ${value} is never negative, when Quality is greater than 0 initially", types, (value) => {
        assertQualityAboveZero(value, 1, 1);
    });

    itParam("The Quality of ${value} is never more than 50, when Quality is 50 initially", types, (value) => {
        assertQualityBelowFifty(value, 1, 50);
    });

    itParam("The Quality of ${value} is never more than 50, when Quality is less than 50 initially", types, (value) => {
        assertQualityBelowFifty(value, 1, 49);
    });
});

describe('Gilded Rose - Sulfuras', () => {
    it('Sulfuras never has to be sold', () => {
        let sulfuras = new GildedRose([new Item('Sulfuras', 2, 3)]);
        const items = sulfuras.updateQuality(); 
        expect(items[0].sellIn).to.equal(2);
    });

    it('Sulfuras never has to decrease in Quality', () => {
        let sulfuras = new GildedRose([new Item('Sulfuras', 2, 3)]);
        const items = sulfuras.updateQuality(); 
        expect(items[0].quality).to.equal(3);
    });
    
    it('Sulfuras never has to decrease in Quality', () => {
        let sulfuras = new GildedRose([new Item('Sulfuras', -1, 3)]);
        const items = sulfuras.updateQuality(); 
        expect(items[0].quality).to.equal(3);
    });
});

describe('Gilded Rose - Aged Brie', () => {
    it('Aged Brie actually increases in Quality the older it gets', () => {
        let agedBrie = new GildedRose([new Item('Aged Brie', 1, 3)]);
        const items = agedBrie.updateQuality(); 
        expect(items[0].quality).to.equal(4);
    });
});

describe('Gilded Rose - Backstage Passes', () => {
    it('Backstage passes increases in Quality by 3 when there are when there are 5 days or less', () => {
        assertQualityAsExpected('Backstage Passes', 2, 10, 13);
    });
    
    it('Backstage passes increases in Quality by 3 when there are when there are 5 days or less, Quality should not be more than 50', () => {
        assertQualityAsExpected('Backstage Passes', 2, 49, 50);
    });

    it('Backstage passes increases in Quality by 2 when there are 10 days or less and more than 5 days', () => {
        assertQualityAsExpected('Backstage Passes', 8, 10, 12);
    });
    
    it('Backstage passes increases in Quality by 2 when there are 10 days or less, Quality should not be more than 50', () => {
        assertQualityAsExpected('Backstage Passes', 8, 49, 50);
    });

    it('Backstage passes increases in Quality by 1 when there are more than 10 days', () => {
        assertQualityAsExpected('Backstage Passes', 12, 10, 11);
    });

    it('Backstage passes Quality drops to 0 after the concert', () => {
        assertQualityAsExpected('Backstage Passes', 0, 10, 0);
    });
});

describe('Gilded Rose - Conjured', function () {
    it('Conjured items degrade in Quality twice as fast as normal items', () => {
        assertQualityAsExpected('Conjured', 2, 5, 3);
    });
    
    it('Conjured items degrade in Quality twice as fast as normal items, Quality should not be below zero', () => {
        assertQualityAsExpected('Conjured', 2, 1, 0);
    });
});

describe('Gilded Rose - Degradable items (not any of sulfuras or backstage passes)', function () {

    it('Once the sell by date of a Normal item has not passed, Quality degrades normally', () => {
        assertQualityAsExpected('normal', 1, 5, 4);
    });
    
    it('Once the sell by date of Conjured has not passed, Quality degrades normally', () => {
        assertQualityAsExpected('Conjured', 1, 5, 3);
    });

    it('Once the sell by date of a normal has passed, Quality degrades twice as fast', ()  => {
        assertQualityAsExpected('normal', 0, 5, 3);
    });

    it('Once the sell by date of a normal has passed, Quality degrades twice as fast, considering Quality cannot be negative', ()  => {
        assertQualityAsExpected('normal', 0, 1, 0);
    });

    it('Once the sell by date of Conjured has passed, Quality degrades twice as fast', ()  => {
        assertQualityAsExpected('Conjured', 0, 5, 1);
    });

    it('Once the sell by date of Conjured has passed, Quality degrades twice as fast, considering Quality cannot be negative', ()  => {
        assertQualityAsExpected('Conjured', 0, 3, 0);
    });

    it('Aged Brie actually increases in Quality the older it gets, twice faster when SellIn has passed', () => {
        assertQualityAsExpected('Aged Brie', 0, 3, 5);
    });
    
    it('Aged Brie actually increases in Quality the older it gets, twice faster when SellIn has passed, not greater than 50', () => {
        assertQualityAsExpected('Aged Brie', 0, 49, 50);
    });
});
