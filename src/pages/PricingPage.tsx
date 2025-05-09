import React from 'react';
import { PricingPlans } from '../components/subscription/PricingPlans';
import { useAuthStore } from '../store/authStore';

export const PricingPage: React.FC = () => {
  const { user, profile } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl mb-6">
            Pricing Plans
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose the perfect plan for your needs
          </p>
        </div>

        <PricingPlans 
          userId={user?.uid || null} 
          currentPlan={profile?.subscription_tier || null} 
        />
      </div>
    </div>
  );
};