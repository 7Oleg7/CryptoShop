// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import storage from '../utils/storage';
import { AuthContext } from './AuthContext';

// Мок-пользователи прямо здесь
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    email: "admin@test.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "Admin",
    isBlocked: false
  },
  {
    id: "2",
    username: "user",
    email: "user@test.com",
    password: "user123",
    firstName: "John",
    lastName: "Doe",
    role: "User",
    isBlocked: false
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = storage.get('user');
      const storedToken = storage.get('token');

      if (storedUser && storedToken) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      
      const foundUser = MOCK_USERS.find(
        u => u.username === username && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      if (foundUser.isBlocked) {
        throw new Error('Your account has been blocked');
      }

      const token = `fake-jwt-token-${Date.now()}`;

      const { password: _, ...userWithoutPassword } = foundUser;

      storage.set('token', token);
      storage.set('user', userWithoutPassword);
      setUser(userWithoutPassword);

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      const existingUser = MOCK_USERS.find(
        u => u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: String(MOCK_USERS.length + 1),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        role: 'User',
        isBlocked: false
      };

      MOCK_USERS.push(newUser);
      
      console.log('User registered:', newUser);

      return { message: 'Registration successful' };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    storage.remove('token');
    storage.remove('user');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      storage.set('user', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};