import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { createCheckoutSession } from '../../lib/stripe';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  priceId: string;
  popular?: boolean;
}

interface PricingPlansProps {
  userId: string | null;
  currentPlan?: string | null;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ userId, currentPlan }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Basic features for personal projects',
      features: [
        { text: '3 projects', included: true },
        { text: 'Basic components', included: true },
        { text: 'Export to HTML/CSS', included: true },
        { text: 'Community support', included: true },
        { text: 'AI component generation', included: false },
        { text: 'Custom themes', included: false },
        { text: 'Team collaboration', included: false },
      ],
      priceId: 'price_free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$12',
      description: 'Advanced features for professionals',
      features: [
        { text: 'Unlimited projects', included: true },
        { text: 'All components', included: true },
        { text: 'Export to React/Next.js', included: true },
        { text: 'Priority support', included: true },
        { text: '50 AI generations/month', included: true },
        { text: 'Custom themes', included: true },
        { text: 'Team collaboration', included: false },
      ],
      priceId: 'price_pro',
      popular: true,
    },
    {
      id: 'team',
      name: 'Team',
      price: '$49',
      description: 'Everything you need for your team',
      features: [
        { text: 'Unlimited projects', included: true },
        { text: 'All components', included: true },
        { text: 'All export options', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Unlimited AI generations', included: true },
        { text: 'Custom themes', included: true },
        { text: 'Team collaboration', included: true },
      ],
      priceId: 'price_team',
    },
  ];

  const handleSubscribe = async (priceId: string, planId: string) => {
    if (!userId) {
      // Redirect to login
      window.location.href = '/login?redirect=pricing';
      return;
    }

    setIsLoading(planId);
    try {
      await createCheckoutSession(userId, priceId);
      // Redirect happens in the createCheckoutSession function
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(null);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <Button
                  className="mt-8 w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  isLoading={isLoading === plan.id}
                  onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                </Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      {feature.included ? (
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      ) : (
                        <X className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};