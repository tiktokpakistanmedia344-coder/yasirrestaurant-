import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS, MENU_CATEGORIES } from './menuData';

const BROKEN_IMAGE_IDS = [
  'photo-1582196016295-f8c8bd4b3e99',
  'photo-1583032015879-5674d852a792',
  'photo-1621996346565-e3d5d628100a',
  'photo-1639024471285-0afc3855f485',
  'photo-1513558161293-cdaf765ed2fd',
  'photo-1546171753-97d7676e4602',
];

test('MENU_ITEMS contains 140 dishes evenly split across 7 categories', () => {
  assert.equal(MENU_CATEGORIES.length, 7);
  assert.equal(MENU_ITEMS.length, 140);

  for (const cat of MENU_CATEGORIES) {
    const count = MENU_ITEMS.filter((item) => item.category === cat.id).length;
    assert.equal(count, 20, `Expected 20 items in ${cat.id}, found ${count}`);
  }
});

test('every menu item has a unique, non-broken image URL', () => {
  const seen = new Map<string, string>();

  for (const item of MENU_ITEMS) {
    assert.ok(
      item.image.startsWith('https://'),
      `Item ${item.id} (${item.name}) must use an HTTPS image URL`
    );
    assert.ok(
      !item.image.includes('live.staticflickr.com'),
      `Item ${item.id} must not use Flickr URLs`
    );
    assert.ok(
      !item.image.includes('upload.wikimedia.org'),
      `Item ${item.id} must not use unscaled upload.wikimedia.org URLs`
    );
    for (const broken of BROKEN_IMAGE_IDS) {
      assert.ok(
        !item.image.includes(broken),
        `Item ${item.id} still references broken URL ${broken}`
      );
    }

    const existingOwner = seen.get(item.image);
    assert.equal(
      existingOwner,
      undefined,
      `Duplicate image detected: ${item.id} (${item.name}) shares URL with ${existingOwner}`
    );
    seen.set(item.image, `${item.id} (${item.name})`);
  }

  assert.equal(seen.size, MENU_ITEMS.length);
});
