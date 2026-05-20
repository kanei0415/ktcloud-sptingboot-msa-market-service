export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string | number) => [...orderKeys.all, 'detail', String(id)] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};

export const inventoryKeys = {
  all: ['inventories'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  detail: (id: string | number) => [...inventoryKeys.all, 'detail', String(id)] as const,
};

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};
