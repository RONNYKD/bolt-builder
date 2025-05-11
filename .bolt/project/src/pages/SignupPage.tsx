import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuthStore } from '../store/authStore';

export const SignupPage: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm mode="signup" onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};