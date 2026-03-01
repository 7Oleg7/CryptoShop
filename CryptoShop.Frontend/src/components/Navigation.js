import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {Link, useNavigate} from 'react-router-dom';

const Navigation = () => {
    const {user, logout} = useAuth();
    const {getCartCount} = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.brand}>CryptoShop</Link>
                
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.link}>Products</Link>
                    
                    {user?.role === 'Admin' && (
                        <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
                    )}
                </div>

                <div style={styles.navLinks}>
                    <Link to="/cart" style={styles.link}>
                        Cart <span style={styles.badge}>{getCartCount()}</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/profile" style={styles.link}>{user.name}</Link>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.link}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#343a40',
        padding: '1rem',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        color: 'white',
        fontSize: '1.5rem',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    link: {
        color: 'rgba(255,255,255,0.75)',
        textDecoration: 'none',
    },
    badge: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        marginLeft: '0.25rem',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid white',
        color: 'white',
        padding: '0.375rem 0.75rem',
        borderRadius: '0.25rem',
        cursor: 'pointer',
    }
};

export default Navigation;
