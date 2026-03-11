import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'New': 'warning',
      'Paid': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Мои заказы</h2>
      
      {orders.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>У вас пока нет заказов</h4>
            <p className="text-muted">Перейдите в каталог и выберите товары</p>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>№ Заказа</th>
              <th>Дата</th>
              <th>Товары</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Транзакция</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</td>
                <td>{order.items?.length || 0} шт.</td>
                <td>{order.totalAmount?.toFixed(2)} ETH</td>
                <td>
                  <Badge bg={getStatusBadge(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td>
                  {order.transactionHash ? (
                    <small className="text-muted">
                      {order.transactionHash.substring(0, 10)}...
                    </small>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;