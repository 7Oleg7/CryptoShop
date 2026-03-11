import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, transactionHash } = location.state || {};

  return (
    <Container className="mt-5">
      <Card className="text-center">
        <Card.Body>
          <FaCheckCircle size={60} className="text-success mb-3" />
          <h2>Order Successful!</h2>
          <p className="lead">Your order has been placed successfully.</p>
          
          {orderId && (
            <p>
              <strong>Order ID:</strong> #{orderId}
            </p>
          )}
          
          {transactionHash && (
            <p>
              <strong>Transaction:</strong>{' '}
              <small className="text-muted">{transactionHash}</small>
            </p>
          )}

          <div className="mt-4">
            <Button 
              variant="primary" 
              onClick={() => navigate('/products')}
              className="me-2"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/profile')}
            >
              View Orders
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccess;