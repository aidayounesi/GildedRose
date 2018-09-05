import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose Basics', function () {

    it('should foo', function() {
        const gildedRose = new GildedRose([new Item('foo', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].name).to.equal('foo');
    });

    it('All items have a SellIn value as a number', function(){
        const gildedRose = new GildedRose([new Item('test', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(typeof items[0].sellIn).to.equal("number");
    });

    it('All items have a Quality value as a number', function(){
        const gildedRose = new GildedRose([new Item('test', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(typeof items[0].quality).to.equal("number");
    });

    it('At the end of each day our system lowers SellIn value', function(){
        const gildedRose = new GildedRose([new Item('test', 1, 3)]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.not.above(1);
    });

    it('At the end of each day our system lowers Quality value', function(){
        const gildedRose = new GildedRose([new Item('test', 1, 3)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.not.above(3);
    });
});

describe('Gilded Rose Interesting', function () {

    it('Once the sell by date has not passed, Quality degrades normally', function() {
        const gildedRose = new GildedRose([new Item('test', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(2);
    });

    it('Once the sell by date has passed, Quality degrades twice as fast', function() {
        const gildedRose = new GildedRose([new Item('test', 1, 3) ]);
        const items = gildedRose.updateQuality(); 
        gildedRose.updateQuality(); //sell by date passed
        expect(items[0].quality).to.equal(0);
    });

    it('The Quality of an item is never negative', function() {
        const gildedRose = new GildedRose([new Item('test', 0, 0) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.below(0);
    });

    it('Aged Brie actually increases in Quality the older it gets', function() {
        const gildedRose = new GildedRose([new Item('Aged Brie', 1, 3) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.above(3);
    });

    it('The Quality of an item is never more than 50', function() {
        const gildedRose = new GildedRose([new Item('test', 1, 50) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.not.above(50);
    });

    it('Sulfuras never has to be sold or decreases in Quality', function() {
        const gildedRose = new GildedRose([new Item('Sulfuras', 1, 3) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.equal(3);
    });
    
    it('Backstage passes increases in Quality by 3 when there are when there are 5 days or less', function() {
        const gildedRose = new GildedRose([new Item('Backstage passes', 1, 3) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.equal(6);
    });

    it('Backstage passes increases in Quality by 2 when there are 10 days or less and more than 5 days', function() {
        const gildedRose = new GildedRose([new Item('Backstage passes', 9, 3) ]);
        const items = gildedRose.updateQuality(); 
        expect(items[0].quality).to.equal(5);
    });

    it('Backstage passes Quality drops to 0 after the concert', function() {
        const gildedRose = new GildedRose([new Item('Backstage passes', 0, 3) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });
});

describe('Gilded Rose New Features', function () {

    it('Conjured items degrade in Quality twice as fast as normal items', function() {
        const gildedRose = new GildedRose([new Item('Conjured', 1, 3) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(1);
    });
});
