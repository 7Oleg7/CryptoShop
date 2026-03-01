import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post('https://localhost:5001/api/auth/login', {
                email,
                password
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true }
        }
        catch (error) {
            return { success: false, error: error.response?.data || 'Login failed' };
        }
        finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('https://localhost:5001/api/auth/register', userData);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.remove('user');
    };

    const updateProfile = async (userId, profileData) => {
        try {
            setLoading(true);
            const response = await axios.put(`https://localhost:5001/api/auth/profile/${userId}`, profileData);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data || 'Update failed' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
