import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const reviewCount = product.reviewsCount || product.reviews?.length || 0;

  return (
    <Card className="h-100 shadow-sm">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img
          variant="top"
          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-warning">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(product.averageRating || 0) ? '#ffc107' : '#e4e5e9'}
                  size={16}
                />
              ))}
              <span className="ms-1 text-muted small">
                ({reviewCount})
              </span>
            </div>
            <h5 className="mb-0">{product.price} ETH</h5>
          </div>
        </Card.Body>
      </Link>
      <Card.Footer className="bg-white">
        <Button
          variant="primary"
          className="w-100"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
        >
          <FaShoppingCart className="me-2" />
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;