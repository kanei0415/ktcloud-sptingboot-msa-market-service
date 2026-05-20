import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CardActions,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import type { Product as ProductModel } from '@typedef/ProductType';
import { palette } from '@libs/theme';

interface Props {
  products: ProductModel[];
}

const Product = ({ products }: Props) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography
        variant="h5"
        align="right"
        sx={{ mb: 3, color: palette.navy, fontWeight: 700 }}
      >
        상품 리스트
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                transition: '0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ p: 1, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                    <CloudQueueIcon sx={{ color: palette.sky }} />
                  </Box>
                  <Chip
                    label="MSA"
                    size="small"
                    sx={{ fontWeight: 600, color: palette.skyDark, bgcolor: '#e0f2fe' }}
                  />
                </Box>

                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  noWrap
                  sx={{ fontWeight: 700 }}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrientation: 'vertical',
                    mb: 2,
                    minHeight: '40px',
                  }}
                >
                  {product.description}
                </Typography>

                <Typography variant="h6" color={palette.navy} sx={{ fontWeight: 800 }}>
                  {product.price.toLocaleString()}{' '}
                  <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
                    원/월
                  </Box>
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShoppingCartOutlinedIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: palette.border,
                    color: '#475569',
                    '&:hover': { borderColor: palette.sky, color: palette.sky, bgcolor: '#f0f9ff' },
                  }}
                >
                  상세보기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Product;
