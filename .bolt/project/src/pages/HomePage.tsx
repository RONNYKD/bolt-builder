import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layout, Zap, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl mb-6">
                  <span className="block">Build beautiful UIs</span>
                  <span className="block text-blue-600">without coding</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create stunning web interfaces with our drag-and-drop builder. 
                  Leverage AI to generate components and export production-ready code.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow transition-shadow duration-200 hover:shadow-xl">
                    <Link to={user ? "/dashboard" : "/login"}>
                      <Button
                        size="lg"
                        rightIcon={<ArrowRight className="ml-2 -mr-1 w-5 h-5" />}
                      >
                        {user ? "Go to Dashboard" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transition-colors duration-200">
                    <Link to="/pricing">
                      <Button
                        variant="outline"
                        size="lg"
                      >
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            alt="Team collaborating on design"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to build amazing UIs
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform combines the best of visual design with AI-powered assistance to help you create beautiful interfaces faster.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600">
                    <Layout className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Drag-and-Drop Builder</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Easily create layouts by dragging and dropping components onto your canvas. No coding required.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Component Generation</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Describe what you need and let our AI generate custom components tailored to your requirements.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Collaboration</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Work together with your team in real-time. See changes as they happen and never lose your work.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Production-Ready Export</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Export your designs as production-ready React components or complete Next.js projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-blue-700"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};