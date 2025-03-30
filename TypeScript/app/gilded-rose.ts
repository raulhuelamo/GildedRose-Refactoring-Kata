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

const ITEM_AGED_BRIE = "Aged Brie";
const ITEM_BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
const ITEM_SULFURAS = "Sulfuras, Hand of Ragnaros";

class GildedRoseItem {
  item: Item;

  minQuality: number = 0;
  maxQuality: number = 50;

  constructor(item: Item) {
    this.item = item;
  }

  private increaseQuality() {
    const isMaxQuality = this.item.quality < this.maxQuality;
    if (!isMaxQuality) return;
    this.item.quality++;
  }

  private decreaseQuality() {
    const isMinQuality = this.item.quality > this.minQuality;
    if (!isMinQuality) return;
    this.item.quality--;
  }

  private dropQuality() {
    this.item.quality = this.minQuality;
  }

  settleDay() {
    const isSulfuras = this.item.name == ITEM_SULFURAS;
    if (isSulfuras) return this.item;

    this.item.sellIn--;

    const isExpired = this.item.sellIn < 0;

    if (this.item.name == ITEM_AGED_BRIE) {
      this.increaseQuality();
      if (isExpired) this.increaseQuality();
      return this.item;
    }

    if (this.item.name == ITEM_BACKSTAGE_PASSES) {
      if (isExpired) {
        this.dropQuality();
        return this.item;
      }

      const isRegularTicket = this.item.sellIn >= 5 && this.item.sellIn < 10;
      const isLateBirdTicket = this.item.sellIn >= 0 && this.item.sellIn < 5;

      const qualityIncreaseMultiplier = (() => {
        if (isLateBirdTicket) return 3;
        else if (isRegularTicket) return 2;
        return 1;
      })();

      Array.from({ length: qualityIncreaseMultiplier }).forEach(() => {
        this.increaseQuality();
      });

      return this.item;
    }

    const isCommon = true;
    if (isCommon) {
      this.decreaseQuality();
      if (isExpired) this.decreaseQuality();
      return this.item;
    }

    throw new Error("Unknown item type");
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    return this.items.map((_item) => {
      const item = new GildedRoseItem(_item);
      return item.settleDay();
    });
  }
}
