import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  isLoading: boolean;
}

interface DecodedToken {
  exp: number;
  iat: number;
  id: string;
  [key: string]: any;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true
  });

  const router = useRouter();

  // Decode JWT token to get expiration
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  };

  // Check if token expires within specified minutes
  const isTokenExpiringSoon = (token: string, minutesThreshold: number = 5): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const thresholdTime = currentTime + (minutesThreshold * 60);
    return decoded.exp < thresholdTime;
  };

  // Logout function
  const logout = useCallback((reason?: string) => {
    console.log(`🚪 Logging out${reason ? ` - ${reason}` : ''}`);
    
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false
    });

    // Show reason to user if provided
    if (reason) {
      alert(`Session ended: ${reason}`);
    }

    // Redirect to login
    router.push('/login');
  }, [router]);

  // Check token validity
  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      logout('Your session has expired. Please log in again.');
      return;
    }

    // Check if token is expiring soon and warn user
    if (isTokenExpiringSoon(token, 5)) {
      const decoded = decodeToken(token);
      if (decoded) {
        const expiryDate = new Date(decoded.exp * 1000);
        console.warn(`⏰ Token expiring soon at ${expiryDate.toLocaleString()}`);
        
        // Optional: Show warning to user
        // You could implement a toast notification here instead of alert
        const extendSession = confirm(
          `Your session expires in less than 5 minutes. Do you want to extend your session?\n\n` +
          `Expires at: ${expiryDate.toLocaleString()}`
        );
        
        if (extendSession) {
          // Implement session refresh here if you have a refresh token endpoint
          // For now, we'll just warn them to save their work
          alert('Please save any unsaved work. You may need to log in again soon.');
        }
      }
    }

    // Token is valid, update auth state
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      isLoading: false
    });
  }, [logout]);

  // Initialize auth state and set up token checking
  useEffect(() => {
    checkTokenValidity();

    // Set up periodic token checking (every minute)
    const interval = setInterval(checkTokenValidity, 60000);

    // Set up visibility change listener to check token when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTokenValidity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkTokenValidity]);

  // Login function
  const login = useCallback((token: string, user: any) => {
    console.log('🔐 useAuth.login() called');
    console.log('🔍 Token received:', token?.substring(0, 20) + '...');
    console.log('🔍 User data:', user);
    
    try {
      console.log('💾 Storing token in localStorage...');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Verify storage worked
      const stored = localStorage.getItem('token');
      console.log('✅ Token storage verification:', !!stored);
      
      if (!stored) {
        console.error('❌ localStorage.setItem failed! Browser blocking?');
        return;
      }
      
      setAuthState({
        isAuthenticated: true,
        token,
        user,
        isLoading: false
      });
      
      console.log('✅ Auth state updated successfully');
    } catch (error) {
      console.error('❌ Error during login:', error);
    }
  }, []);

  // Get token with automatic validation
  const getValidToken = useCallback((): string | null => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('🚫 No token found');
      return null;
    }

    if (isTokenExpired(token)) {
      logout('Your session has expired. Please log in again.');
      return null;
    }

    return token;
  }, [logout]);

  // API call wrapper with automatic token validation
  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = getValidToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check for 401 unauthorized - token might be invalid
    if (response.status === 401) {
      logout('Your session is no longer valid. Please log in again.');
      throw new Error('Unauthorized');
    }

    return response;
  }, [getValidToken, logout]);

  return {
    ...authState,
    login,
    logout,
    getValidToken,
    authenticatedFetch,
    checkTokenValidity,
    isTokenExpired: (token?: string) => token ? isTokenExpired(token) : true,
    isTokenExpiringSoon: (token?: string) => token ? isTokenExpiringSoon(token) : true,
  };
};

export default useAuth;