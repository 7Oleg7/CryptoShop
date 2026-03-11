import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaBox, FaClipboardList, FaHeart, FaCog } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaHome className="me-2" />
          CryptoShop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Главная
            </Nav.Link>
            
            <Nav.Link as={Link} to="/products">
              <FaBox className="me-1" /> Товары
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link as={Link} to="/orders">
                  <FaClipboardList className="me-1" /> Мои заказы
                </Nav.Link>
                
                <Nav.Link as={Link} to="/wishlist">
                  <FaHeart className="me-1" /> Избранное
                </Nav.Link>
              </>
            )}
            
            {user?.role === 'Admin' && (
              <Nav.Link as={Link} to="/admin">
                <FaCog className="me-1" /> Админ панель
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            <Nav.Link as={Link} to="/cart" className="position-relative me-2">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.6rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
            
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center">
                  <FaUser size={18} className="me-1" /> 
                  <span className="d-none d-lg-inline">{user.username}</span>
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  <FaSignOutAlt />
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;