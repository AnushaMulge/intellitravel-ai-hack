import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { Calendar, MapPin, Users, IndianRupee, Heart, Loader2 } from 'lucide-react';
import { indianDestinations, interestTags, budgetRanges } from '../mock';

const PlanningForm = ({ onSubmit, isGenerating, showForm }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: [25000],
    groupSize: 2,
    interests: [],
    accommodation: 'mid-range'
  });

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getBudgetLabel = (value) => {
    const range = budgetRanges.find(r => value >= r.min && value <= r.max);
    return range ? range.label : `₹${value.toLocaleString()}`;
  };

  if (!showForm && !isGenerating) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <h4 className="text-lg font-semibold text-amber-900 mb-2">Ready to Explore India?</h4>
        <p className="text-amber-700 mb-6">Click "Start Planning Now" to begin your journey</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-600 to-red-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
        <h4 className="text-lg font-semibold text-amber-900 mb-2">Creating Your Perfect Itinerary</h4>
        <p className="text-amber-700 mb-4">Our AI is analyzing destinations, weather, and cultural events...</p>
        <div className="w-48 h-2 bg-amber-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-600 to-red-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination Selection */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="text-amber-800 font-medium">
          <MapPin className="w-4 h-4 inline mr-2" />
          Where would you like to go?
        </Label>
        <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
          <SelectTrigger className="bg-white/60 backdrop-blur-sm border-amber-200">
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            {indianDestinations.map(dest => (
              <SelectItem key={dest.id} value={dest.name}>
                {dest.name}, {dest.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-amber-800 font-medium">
            <Calendar className="w-4 h-4 inline mr-2" />
            Start Date
          </Label>
          <Input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="bg-white/60 backdrop-blur-sm border-amber-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-amber-800 font-medium">End Date</Label>
          <Input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="bg-white/60 backdrop-blur-sm border-amber-200"
          />
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label className="text-amber-800 font-medium">
          <IndianRupee className="w-4 h-4 inline mr-2" />
          Budget per person
        </Label>
        <div className="px-3">
          <Slider
            value={formData.budget}
            onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
            max={100000}
            min={5000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-amber-700 mt-2">
            <span>₹5K</span>
            <span className="font-medium text-red-700">{getBudgetLabel(formData.budget[0])}</span>
            <span>₹1L+</span>
          </div>
        </div>
      </div>

      {/* Group Size */}
      <div className="space-y-2">
        <Label className="text-amber-800 font-medium">
          <Users className="w-4 h-4 inline mr-2" />
          Group Size
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 6].map(size => (
            <Button
              key={size}
              type="button"
              variant={formData.groupSize === size ? "default" : "outline"}
              className={formData.groupSize === size 
                ? "bg-gradient-to-r from-amber-600 to-red-600 text-white border-0" 
                : "bg-white/60 border-amber-200 text-amber-800 hover:bg-amber-100"
              }
              onClick={() => setFormData(prev => ({ ...prev, groupSize: size }))}
            >
              {size} {size === 1 ? 'Solo' : 'People'}
            </Button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="text-amber-800 font-medium">
          <Heart className="w-4 h-4 inline mr-2" />
          Your Interests
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {interestTags.map(interest => (
            <Badge
              key={interest.id}
              variant={formData.interests.includes(interest.id) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-2 justify-start transition-all ${
                formData.interests.includes(interest.id)
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white border-0 hover:from-amber-700 hover:to-red-700'
                  : 'bg-white/60 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
              onClick={() => handleInterestToggle(interest.id)}
            >
              <span className="mr-2">{interest.icon}</span>
              {interest.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0 py-3 text-lg font-semibold"
        disabled={!formData.destination || !formData.startDate || !formData.endDate}
      >
        Generate My Perfect Itinerary
      </Button>
    </form>
  );
};

export default PlanningForm;
