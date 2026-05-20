import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Paper,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteForeverOutlined as DeleteIcon,
  AddShoppingCart as AddCartIcon,
  ShoppingBasket as BasketIcon,
} from '@mui/icons-material';
import type { Inventory } from '@typedef/InventoryType';
import type { Product } from '@typedef/ProductType';
import type { SelectedOrderItem } from '@typedef/SelectedOrderItem';

interface Props {
  productInventoriesInfo: Array<[Product, Inventory[]]>;
  selectedItems: SelectedOrderItem[];
  isSubmitting: boolean;
  onCreateButtonClicked: () => void;
  addProductInventoryItem: (p: Product, i: Inventory) => void;
  removeProductInventoryItem: (p: Product, i: Inventory) => void;
  updateProductInventoryItemQuantity: (p: Product, i: Inventory, delta: number) => void;
}

const OrderCreate = ({
  productInventoriesInfo,
  selectedItems,
  isSubmitting,
  onCreateButtonClicked,
  addProductInventoryItem,
  removeProductInventoryItem,
  updateProductInventoryItemQuantity,
}: Props) => {
  const findSelected = (inventoryId: number) =>
    selectedItems.find((item) => item.inventory.id === inventoryId);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
          주문 생성
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<BasketIcon />}
          onClick={onCreateButtonClicked}
          disabled={selectedItems.length === 0 || isSubmitting}
          sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
        >
          {isSubmitting ? '처리 중…' : `주문 완료 (${selectedItems.length})`}
        </Button>
      </Box>

      <Stack spacing={4}>
        {productInventoriesInfo.map(([product, inventories]) => (
          <Card key={product.id} variant="outlined" sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {product.price.toLocaleString()}원
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {inventories.map((inventory) => {
                  const selected = findSelected(inventory.id);
                  const isAdded = Boolean(selected);
                  const currentQuantity = selected?.quantity ?? 0;

                  return (
                    <Paper
                      key={inventory.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        bgcolor: isAdded ? 'action.hover' : 'background.paper',
                        borderColor: isAdded ? 'primary.light' : 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.primary">
                          SKU: {inventory.skuCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          가용 재고: {inventory.quantity}개
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isAdded && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <IconButton
                              size="small"
                              aria-label="수량 감소"
                              onClick={() =>
                                updateProductInventoryItemQuantity(product, inventory, -1)
                              }
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography
                              sx={{
                                mx: 2,
                                minWidth: 20,
                                textAlign: 'center',
                                fontWeight: 'bold',
                              }}
                            >
                              {currentQuantity}
                            </Typography>
                            <IconButton
                              size="small"
                              aria-label="수량 증가"
                              disabled={currentQuantity >= inventory.quantity}
                              onClick={() =>
                                updateProductInventoryItemQuantity(product, inventory, 1)
                              }
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}

                        {isAdded ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => removeProductInventoryItem(product, inventory)}
                          >
                            삭제
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AddCartIcon />}
                            disabled={inventory.quantity <= 0}
                            onClick={() => addProductInventoryItem(product, inventory)}
                          >
                            추가
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {productInventoriesInfo.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            py: 10,
            textAlign: 'center',
            borderRadius: 3,
            borderStyle: 'dashed',
            bgcolor: 'grey.50',
          }}
        >
          <Typography color="text.secondary">표시할 상품 정보가 없습니다.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default OrderCreate;
