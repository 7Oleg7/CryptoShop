import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ReviewList = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5082/api/reviews/product/${productId}`);
        setReviews(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Не удалось загрузить отзывы');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Необходимо войти в систему');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('http://localhost:5082/api/reviews', {
        productId,
        userId,
        rating,
        comment
      });

      const response = await axios.get(`http://localhost:5082/api/reviews/product/${productId}`);
      setReviews(response.data);
      
      setComment('');
      setSuccess('Отзыв добавлен!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Ошибка при отправке отзыва');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="mt-4 text-center">
        <p>Загрузка отзывов...</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4>Отзывы</h4>
      
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Оставить отзыв</Card.Title>
          
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Оценка</Form.Label>
              <Form.Select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={!userId}
              >
                <option value="5">5 звезд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="2">2 звезды</option>
                <option value="1">1 звезда</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!userId}
                placeholder={userId ? "Ваш отзыв..." : "Войдите, чтобы оставить отзыв"}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting || !userId}
            >
              {submitting ? 'Отправка...' : 'Отправить'}
            </Button>
            
            {!userId && (
              <p className="text-muted mt-2 small">
                Чтобы оставить отзыв, необходимо <a href="/login">войти</a>
              </p>
            )}
          </Form>
        </Card.Body>
      </Card>

      {reviews.length === 0 ? (
        <p className="text-muted">Пока нет отзывов</p>
      ) : (
        reviews.map(review => (
          <Card key={review.id} className="mb-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{review.userName || review.user?.name || 'Пользователь'}</strong>
                  <div className="text-warning">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <small className="text-muted">
                  {new Date(review.createdAt || review.date).toLocaleDateString()}
                </small>
              </div>
              <p className="mt-2">{review.comment}</p>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReviewList;