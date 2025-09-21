// App.js

import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Itinerary from './components/Itinerary';
import Footer from './components/Footer';
// The mockItinerary is for testing only, you can remove it later
// import { mockItinerary } from './mock'; 

function App() {
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlanTrip = async (formData) => {
    setIsGenerating(true);
    
    // 1. Get the duration in days
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // 2. Prepare the data for the API request
    const payload = {
      destination: formData.destination,
      duration: durationInDays, // The backend expects a number, not dates
      budget: formData.budget[0],
      group_size: formData.groupSize, // Your backend expects snake_case keys
      interests: formData.interests,
      start_date: formData.startDate,
      end_date: formData.endDate,
    };
    
    try {
      const response = await fetch('https://intellitravel-backend-460106378500.us-central1.run.app/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setGeneratedItinerary(data.itinerary); // Set the state with the actual data
    } catch (error) {
      console.error('Error:', error);
      // Handle the error (e.g., show a message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-red-400/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-xl"></div>
      </div>

      <Header />
      <Hero onPlanTrip={handlePlanTrip} isGenerating={isGenerating} />
      
      {generatedItinerary && (
        <div className="py-20">
          <Itinerary itinerary={generatedItinerary} />
        </div>
      )}
      
      <Features />
      <Footer />
    </div>
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
