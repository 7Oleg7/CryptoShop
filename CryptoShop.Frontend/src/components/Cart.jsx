import React from 'react';
import { Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h3>Your cart is empty</h3>
        <p>Browse our products and add some items to your cart!</p>
        <Button as={Link} to="/products" variant="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Shopping Cart</h2>
      <Row>
        <Col lg={8}>
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/50'}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="me-3"
                      />
                      <div>
                        <Link to={`/product/${item.id}`} className="text-decoration-none">
                          {item.name}
                        </Link>
                        <small className="d-block text-muted">
                          {item.categoryName}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{item.price} ETH</td>
                  <td style={{ width: '120px' }}>
                    <Form.Control
                      type="number"
                      min="1"
                      max={item.stockQuantity}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)} ETH</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            as={Link}
            to="/products"
            variant="outline-primary"
            className="mb-3"
          >
            <FaArrowLeft className="me-2" />
            Continue Shopping
          </Button>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5>Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{cartTotal.toFixed(2)} ETH</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>{cartTotal.toFixed(2)} ETH</strong>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100"
                onClick={handleCheckout}
              >
                <FaCreditCard className="me-2" />
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;