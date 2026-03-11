import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [message, setMessage] = useState('');

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setMessage('Товар удален из избранного');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setMessage('Товар добавлен в корзину');
    setTimeout(() => setMessage(''), 3000);
  };

  if (wishlist.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <FaHeart size={60} className="text-muted mb-3" />
        <h3>Список избранного пуст</h3>
        <p className="text-muted">Добавляйте товары в избранное, чтобы не потерять их</p>
        <Button as={Link} to="/products" variant="primary">
          Перейти к товарам
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Избранное</h2>
      
      {message && <Alert variant="success">{message}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {wishlist.map(product => (
          <Col key={product.id}>
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={product.imageUrl || 'https://via.placeholder.com/300'} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-muted small">
                  {product.categoryName || product.category}
                </Card.Text>
                <Card.Text className="text-truncate">
                  {product.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">${product.price}</h5>
                  <div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeFromWishlist(product.id)}
                      className="me-2"
                    >
                      <FaTrash />
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;