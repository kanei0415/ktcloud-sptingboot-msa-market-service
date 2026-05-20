import { orderKeys, productKeys, inventoryKeys, authKeys } from '@libs/query-keys';

describe('query-keys', () => {
  describe('orderKeys', () => {
    it('all returns the root segment', () => {
      expect(orderKeys.all).toEqual(['orders']);
    });

    it('lists() appends "list"', () => {
      expect(orderKeys.lists()).toEqual(['orders', 'list']);
    });

    it('detail() coerces numeric ids to string', () => {
      expect(orderKeys.detail(42)).toEqual(['orders', 'detail', '42']);
      expect(orderKeys.detail('abc')).toEqual(['orders', 'detail', 'abc']);
    });
  });

  describe('productKeys', () => {
    it('detail() keeps string id as-is', () => {
      expect(productKeys.detail('sku-1')).toEqual(['products', 'detail', 'sku-1']);
    });
  });

  describe('inventoryKeys', () => {
    it('detail() coerces numeric ids', () => {
      expect(inventoryKeys.detail(7)).toEqual(['inventories', 'detail', '7']);
    });
  });

  describe('authKeys', () => {
    it('me() appends "me"', () => {
      expect(authKeys.me()).toEqual(['auth', 'me']);
    });
  });
});
