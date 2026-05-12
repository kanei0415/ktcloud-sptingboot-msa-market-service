import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CardActions
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import type { Product } from "@typedef/ProductType";

type Props = {
  products: Product[];
};

const ProductList = ({ products }: Props) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#102a43' }} align='right'>
        상품 리스트
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                transition: '0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ p: 1, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                    <CloudQueueIcon sx={{ color: '#38bdf8' }} />
                  </Box>
                  <Chip label="MSA" size="small" sx={{ fontWeight: 600, color: '#0ea5e9', bgcolor: '#e0f2fe' }} />
                </Box>

                <Typography gutterBottom variant="h6" component="h2" fontWeight={700} noWrap>
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
                    minHeight: '40px'
                  }}
                >
                  {product.description}
                </Typography>

                <Typography variant="h6" color="#102a43" fontWeight={800}>
                  {product.price.toLocaleString()} <Typography component="span" variant="body2">원/월</Typography>
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
                    borderColor: '#e2e8f0',
                    color: '#475569',
                    '&:hover': { borderColor: '#38bdf8', color: '#38bdf8', bgcolor: '#f0f9ff' }
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

export default ProductList;