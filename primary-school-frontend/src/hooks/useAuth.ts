import { useState, useEffect } from 'react';
import { API } from '../services';
import Cookies from 'js-cookie';

interface User {
    _id: string;
    email: string;
    username: string;
    role: string;
    isJoinedToSubject: boolean;
    subjects: string[];
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('sessionToken');
            if (token) {
                try {
                    const response = await API.get('/auth/current-user');
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    Cookies.remove('sessionToken');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    return { isAuthenticated, user, loading };
}; 