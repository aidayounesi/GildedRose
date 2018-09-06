import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

const itParam = require('mocha-param').itParam

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

    it('At the end of each day our system lowers SellIn value', () =>{
        const gildedRose = new GildedRose([new Item('basic', 1, 3)]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.not.above(1);
    });

    it('At the end of each day our system lowers Quality value', () =>{
        const gildedRose = new GildedRose([new Item('basic', 1, 3)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.not.above(3);
    });
});

describe('Gilded Rose - General', ()=> {
    const types = ['Sulfuras', 'Aged Brie', 'Conjured', 'Backstage passes', 'normal']

    itParam("The Quality of ${value} is never negative, when Quality is 0 initially", types, (value) => {
        const gildedRose = new GildedRose([new Item(value, 1, 0) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.below(0);
    });

    itParam("The Quality of ${value} is never negative, when Quality is greater than 0 initially", types, (value) => {
        const gildedRose = new GildedRose([new Item(value, 1, 1) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.below(0);
    });

    itParam("The Quality of ${value} is never more than 50, when Quality is 50 initially", types, (value) => {
        const gildedRose = new GildedRose([new Item(value, 1, 50) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.above(50);
    });

    itParam("The Quality of ${value} is never more than 50, when Quality is less than 50 initially", types, (value) => {
        const gildedRose = new GildedRose([new Item(value, 1, 49) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.above(50);
    });
});

describe('Gilded Rose - Sulfuras', () => {
    const initSellIn = 2;
    const initQuality = 3;
    var sulfuras;
    beforeEach(() => {
        sulfuras = new GildedRose([new Item('Sulfuras', initSellIn, initQuality)]);
    });

    it('Sulfuras never has to be sold', () => {
        const items = sulfuras.updateQuality(); 
        expect(items[0].sellIn).to.equal(initSellIn);
    });

    it('Sulfuras never has to decrease in Quality', () => {
        const items = sulfuras.updateQuality(); 
        expect(items[0].quality).to.equal(initQuality);
    });
});

describe('Gilded Rose - Aged Brie', () => {
    const initSellIn = 2;
    const initQuality = 3;
    var agedBrie;
    beforeEach(() => {
        agedBrie = new GildedRose([new Item('Aged Brie', initSellIn, initQuality)]);
    });
    
    it('Aged Brie actually increases in Quality the older it gets', () => {
        const items = agedBrie.updateQuality(); 
        expect(items[0].quality).to.above(initQuality);
    });
});

describe('Gilded Rose - Backstage Passes', () => {
    
    it('Backstage passes increases in Quality by 3 when there are when there are 5 days or less', () => {
        const initSellIn = 2;
        const initQuality = 3;
        var backStagePasses = new GildedRose([new Item('Backstage Passes', initSellIn, initQuality)]);
        const items = backStagePasses.updateQuality(); 
        expect(items[0].quality).to.equal(initQuality+3);
    });

    it('Backstage passes increases in Quality by 2 when there are 10 days or less and more than 5 days', () => {
        const initSellIn = 8;
        const initQuality = 3;
        var backStagePasses = new GildedRose([new Item('Backstage Passes', initSellIn, initQuality)]);
        const items = backStagePasses.updateQuality(); 
        expect(items[0].quality).to.equal(initQuality+2);
    });

    it('Backstage passes Quality drops to 0 after the concert', () => {
        const initSellIn = 0;
        const initQuality = 3;
        var backStagePasses = new GildedRose([new Item('Backstage Passes', initSellIn, initQuality)]);
        const items = backStagePasses.updateQuality();
        expect(items[0].quality).to.equal(0);
    });
});

describe('Gilded Rose - Degradable items (not aged brie or sulfuras or backstage passes)', function () {
    const degradingRates = [['Conjured', 2], ['normal', 1]]
    const initQuality = 3;

    itParam('Once the sell by date of ${value[0]} has not passed, Quality degrades normally', degradingRates, (value) => {
        const gildedRose = new GildedRose([new Item(value[0], 1, initQuality) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(initQuality - value[1]);
    });

    itParam('Once the sell by date of ${value[0]} has passed, Quality degrades twice as fast', degradingRates, (value)  => {
        const gildedRose = new GildedRose([new Item(value[0], 0, initQuality) ]);
        const items = gildedRose.updateQuality(); //sell by date passed
        expect(items[0].quality).to.equal(initQuality - 2 * value[1]);
    });
});

describe('Gilded Rose New Features', function () {

    it('Conjured items degrade in Quality twice as fast as normal items', () => {
        const gildedRose = new GildedRose([new Item('Conjured', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(1);
    });
});
