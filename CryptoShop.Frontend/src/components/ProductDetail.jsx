import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import ReviewList from './ReviewList';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProduct } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center mt-5">
        <h3>Товар не найден</h3>
        <Button variant="primary" onClick={handleGoBack}>
          <FaArrowLeft className="me-2" /> Вернуться назад
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={handleGoBack} className="mb-3">
        <FaArrowLeft className="me-2" /> Назад
      </Button>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img 
              variant="top" 
              src={product.imageUrl || 'https://via.placeholder.com/600x400'} 
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Badge bg="secondary" className="mb-2">{product.categoryName || product.category}</Badge>
              <h2>{product.name}</h2>
              
              <div className="d-flex align-items-center mb-3">
                <div className="text-warning me-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < Math.round(product.averageRating || 0) ? '#ffc107' : '#e4e5e9'}
                    />
                  ))}
                </div>
                <span className="text-muted">
                  ({product.reviewsCount || 0} отзывов)
                </span>
              </div>

              <h3 className="text-primary mb-3">{product.price} ETH</h3>
              
              <p className="mb-4">{product.description}</p>

              <div className="mb-3">
                <strong>Наличие: </strong>
                {product.stockQuantity > 0 ? (
                  <Badge bg="success">В наличии ({product.stockQuantity} шт.)</Badge>
                ) : (
                  <Badge bg="danger">Нет в наличии</Badge>
                )}
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-4">
                  <h5>Характеристики:</h5>
                  <ul className="list-unstyled">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Row className="align-items-center">
                <Col xs={4}>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={product.stockQuantity === 0}
                  />
                </Col>
                <Col xs={8}>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                  >
                    <FaShoppingCart className="me-2" />
                    {product.stockQuantity === 0 ? 'Нет в наличии' : 'В корзину'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <ReviewList productId={product.id} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;