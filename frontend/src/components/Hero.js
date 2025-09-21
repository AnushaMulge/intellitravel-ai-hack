import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import PlanningForm from './PlanningForm';
import { Sparkles, MapPin, Calendar, IndianRupee } from 'lucide-react';

const Hero = ({ onPlanTrip, isGenerating }) => {
  const [showForm, setShowForm] = useState(false);

  const handleStartPlanning = () => {
    setShowForm(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-orange-100/40 to-red-100/60"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Hero Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300/50">
              <Sparkles className="w-4 h-4 text-amber-700 mr-2" />
              <span className="text-sm font-medium text-amber-800">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-amber-700 via-red-600 to-orange-700 bg-clip-text text-transparent">
                Plan Your Perfect
              </span>
              <br />
              <span className="text-amber-900">Indian Adventure</span>
            </h1>
            
            <p className="text-xl text-amber-800 leading-relaxed max-w-lg">
              Discover India's incredible diversity with AI-powered itineraries that blend heritage, culture, and adventure. From the Himalayas to Kerala's backwaters.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-700">500+</div>
              <div className="text-sm text-amber-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">50K+</div>
              <div className="text-sm text-amber-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.9★</div>
              <div className="text-sm text-amber-600">User Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 px-8 py-4 text-lg"
              onClick={handleStartPlanning}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Start Planning Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-amber-300 text-amber-800 hover:bg-amber-100 px-8 py-4 text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Sample Trips
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="font-semibold text-amber-900">Budget Friendly</div>
                <div className="text-sm text-amber-700">Plans starting ₹5,000</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <div className="font-semibold text-amber-900">AI Optimized</div>
                <div className="text-sm text-amber-700">Personalized for you</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Planning Form */}
        <div className="lg:pl-12">
          <Card className="backdrop-blur-lg bg-amber-50/40 border border-amber-200/50 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  Plan Your Journey
                </h3>
                <p className="text-amber-700">
                  Tell us your preferences and let AI create magic
                </p>
              </div>
              
              <PlanningForm 
                onSubmit={onPlanTrip} 
                isGenerating={isGenerating}
                showForm={showForm}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
