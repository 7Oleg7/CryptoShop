import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaBolt } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);
  const topRated = [...products].sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);

  return (
    <Container className="mt-4">
      <div className="bg-primary text-white p-5 rounded-3 mb-4">
        <h1>Добро пожаловать в CryptoShop</h1>
        <p className="lead">Покупайте товары с криптовалютой. Быстро, безопасно, удобно.</p>
        <Button as={Link} to="/products" variant="light" size="lg">
          Начать покупки <FaArrowRight className="ms-2" />
        </Button>
      </div>

      <h2 className="mb-3">Популярные товары</h2>
      <Row xs={1} md={3} className="g-4 mb-5">
        {featuredProducts.map(product => (
          <Col key={product.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={product.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-muted">{product.description.substring(0, 60)}...</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{product.price} ETH</h5>
                  <Button as={Link} to={`/product/${product.id}`} variant="primary" size="sm">
                    Подробнее
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaBolt size={40} className="text-warning mb-3" />
              <h5>Мгновенные платежи</h5>
              <p className="text-muted">Оплачивайте заказы криптовалютой за секунды</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaStar size={40} className="text-warning mb-3" />
              <h5>Топ-рейтинг</h5>
              <p className="text-muted">Только проверенные товары с высокими оценками</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaArrowRight size={40} className="text-warning mb-3" />
              <h5>Быстрая доставка</h5>
              <p className="text-muted">Доставляем по всему миру</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-3">Лучшие по рейтингу</h2>
      <Row xs={1} md={3} className="g-4">
        {topRated.map(product => (
          <Col key={product.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={product.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <div className="d-flex align-items-center mb-2">
                  <FaStar className="text-warning me-1" />
                  <span>{product.averageRating.toFixed(1)}</span>
                </div>
                <Button as={Link} to={`/product/${product.id}`} variant="outline-primary" size="sm" className="w-100">
                  Посмотреть
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;