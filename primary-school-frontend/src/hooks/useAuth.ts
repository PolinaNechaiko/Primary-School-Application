import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { API } from '../services';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('sessionToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Отримуємо актуальну інформацію про користувача
                const response = await API.get('/user/me');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Якщо помилка, видаляємо токен
                Cookies.remove('sessionToken');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}; 