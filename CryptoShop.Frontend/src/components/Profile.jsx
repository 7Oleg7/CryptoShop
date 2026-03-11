import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  });

  const fetchUserData = async () => {
    try {
      const [ordersRes, reviewsRes] = await Promise.all([
        api.get(`/orders/user/${user.id}`),
        api.get(`/reviews/user/${user.id}`)
      ]);
      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(profileForm);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'New': return 'warning';
      case 'Paid': return 'info';
      case 'Shipped': return 'primary';
      case 'Delivered': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container className="mt-4">
      <h2>My Profile</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs defaultActiveKey="profile" className="mb-4">
        <Tab eventKey="profile" title="Profile Information">
          <Row>
            <Col md={6}>
              <Card className="mt-3">
                <Card.Body>
                  <h5>Edit Profile</h5>
                  <Form onSubmit={handleProfileUpdate}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                      Update Profile
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mt-3">
                <Card.Body>
                  <h5>Change Password</h5>
                  <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                      Change Password
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="orders" title="Order History">
          <Card className="mt-3">
            <Card.Body>
              <h5>My Orders</h5>
              {orders.length === 0 ? (
                <p className="text-muted">No orders yet</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Items</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.totalAmount.toFixed(2)} ETH</td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.items.length}</td>
                        <td>
                          {order.transactionHash ? (
                            <small className="text-muted">
                              {order.transactionHash.substring(0, 10)}...
                            </small>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="reviews" title="My Reviews">
          <Card className="mt-3">
            <Card.Body>
              <h5>My Reviews</h5>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet</p>
              ) : (
                reviews.map(review => (
                  <Card key={review.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <h6>Product #{review.productId}</h6>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="mb-0">{review.comment}</p>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;