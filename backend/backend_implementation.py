import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import aiplatform
import vertexai
from vertexai.language_models import TextGenerationModel
import requests

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('service-account-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Vertex AI
PROJECT_ID = "intellitravel-ai-hack"
LOCATION = "us-central1"
vertexai.init(project=PROJECT_ID, location=LOCATION)

# Initialize the Gemini model
model = TextGenerationModel.from_pretrained("text-bison@002")

class IntelliTravelAI:
    def __init__(self):
        self.db = db
        self.model = model
        
    def generate_itinerary_prompt(self, user_preferences, extra_data):
        """Generate detailed prompt for Vertex AI with enriched data"""
        
        # Extract data from the extra_data dictionary
        wikipedia_summary = extra_data.get('wikipedia_summary', '')
        cultural_data = extra_data.get('cultural_data', [])
        unesco_sites = extra_data.get('unesco_sites', [])
        
        prompt = f"""
        You are an expert Indian travel planner with deep knowledge of Indian culture, geography, and travel patterns. 
        You have access to additional information to create a richer itinerary.

        **Destination Overview:**
        {wikipedia_summary}

        **Additional Cultural Information:**
        - Cultural Insights: {', '.join(cultural_data)}
        - UNESCO World Heritage Sites: {', '.join(unesco_sites)}
        
        Create a detailed {user_preferences['duration']}-day itinerary for {user_preferences['destination']} with the following requirements:
        
        **Travel Details:**
        - Destination: {user_preferences['destination']}
        - Duration: {user_preferences['duration']} days
        - Budget: ₹{user_preferences['budget']}
        - Travel Dates: {user_preferences['start_date']} to {user_preferences['end_date']}
        - Group Size: {user_preferences['group_size']} people
        - Interests: {', '.join(user_preferences['interests'])}
        
        **Requirements:**
        1. Stay within the budget of ₹{user_preferences['budget']}
        2. Include cultural experiences specific to the region
        3. Suggest local cuisine and restaurants
        4. Include transportation details (train/flight/local transport)
        5. Add seasonal considerations and weather-appropriate activities
        6. Include UNESCO heritage sites if available in the region
        7. Provide cost breakdown for each day
        
        **Output Format (JSON):**
        {{
            "itinerary": [
                {{
                    "day": 1,
                    "date": "YYYY-MM-DD",
                    "activities": [
                        {{
                            "time": "09:00 AM",
                            "activity": "Activity name",
                            "location": "Specific location",
                            "description": "Detailed description",
                            "cost": 500,
                            "category": "sightseeing/food/transport/accommodation"
                        }}
                    ],
                    "accommodation": {{
                        "name": "Hotel name",
                        "cost": 2000,
                        "location": "Area"
                    }},
                    "total_day_cost": 3500
                }}
            ],
            "total_cost": 25000,
            "transportation": {{
                "to_destination": {{
                    "mode": "train/flight",
                    "details": "Specific train/flight details",
                    "cost": 3000
                }},
                "local_transport": "Auto/taxi/bus recommendations",
                "from_destination": {{
                    "mode": "train/flight",
                    "details": "Return details",
                    "cost": 3000
                }}
            }},
            "cultural_insights": [
                "Local customs to be aware of",
                "Festival information if applicable",
                "Regional etiquette"
            ],
            "packing_suggestions": [
                "Weather-appropriate clothing",
                "Cultural considerations",
                "Essential items"
            ]
        }}
        """
        return prompt
    
    def get_weather_data(self, destination, start_date):
        """Get weather data for the destination"""
        # Using OpenWeatherMap API (replace with your API key)
        api_key = "[Weather_API_Key]"
        base_url = "http://api.openweathermap.org/data/2.5/forecast"
        
        try:
            # Get coordinates for Indian cities
            geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={destination},IN&appid={api_key}"
            geo_response = requests.get(geo_url)
            geo_data = geo_response.json()
            
            if geo_data:
                lat, lon = geo_data[0]['lat'], geo_data[0]['lon']
                weather_url = f"{base_url}?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                weather_response = requests.get(weather_url)
                return weather_response.json()
        except:
            pass
        
        return None
    
    def get_places_data(self, destination):
        """Get places data using Google Places API"""
        # Replace with your Google Places API key
        api_key = "[Places_API_Key]"
        base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        
        queries = [
            f"tourist attractions in {destination} India",
            f"restaurants in {destination} India",
            f"hotels in {destination} India",
            f"cultural sites in {destination} India"
        ]
        
        places_data = {}
        for query in queries:
            try:
                url = f"{base_url}?query={query}&key={api_key}"
                response = requests.get(url)
                places_data[query.split()[0]] = response.json()
            except:
                continue
                
        return places_data

    def generate_itinerary(self, user_preferences):
        """Generate itinerary using Vertex AI"""
        try:
            # Get enriched data from various sources as suggested in the PDF
            weather_data = self.get_weather_data(user_preferences['destination'], user_preferences['start_date'])
            places_data = self.get_places_data(user_preferences['destination'])
            wikipedia_summary = self.get_wikipedia_summary(user_preferences['destination'])
            cultural_data = self.get_cultural_insights(user_preferences['destination'])
            unesco_sites = self.get_unesco_sites(user_preferences['destination'])
        
            # Prepare extra data for the prompt
            extra_data = {
                'wikipedia_summary': wikipedia_summary,
                'cultural_data': cultural_data,
                'unesco_sites': unesco_sites
            }
            
            # Generate the enriched prompt
            prompt = self.generate_itinerary_prompt(user_preferences, extra_data)
            
            # Call Vertex AI
            response = self.model.predict(
                prompt,
                temperature=0.7,
                max_output_tokens=4096,
                top_p=0.8,
                top_k=40,
            )
            
            # Parse the response
            generated_text = response.text
            
            # Try to extract JSON from the response
            try:
                # Find JSON in the response
                start_idx = generated_text.find('{')
                end_idx = generated_text.rfind('}') + 1
                json_str = generated_text[start_idx:end_idx]
                itinerary_data = json.loads(json_str)
            except:
                # Fallback: create a structured response from text
                itinerary_data = self.parse_text_response(generated_text, user_preferences)
            
            # Add weather data
            if weather_data:
                itinerary_data['weather_forecast'] = weather_data
                
            # Add places data
            if places_data:
                itinerary_data['nearby_places'] = places_data
            
            return itinerary_data
            
        except Exception as e:
            print(f"Error generating itinerary: {str(e)}")
            return self.create_fallback_itinerary(user_preferences)
    
    def parse_text_response(self, text, preferences):
        """Parse text response into structured format"""
        # This is a fallback method to structure unstructured text
        return {
            "itinerary": [
                {
                    "day": 1,
                    "date": preferences['start_date'],
                    "activities": [
                        {
                            "time": "09:00 AM",
                            "activity": "Explore local attractions",
                            "location": preferences['destination'],
                            "description": "Start your journey exploring the main attractions",
                            "cost": 1000,
                            "category": "sightseeing"
                        }
                    ],
                    "accommodation": {
                        "name": f"Hotel in {preferences['destination']}",
                        "cost": 2000,
                        "location": "City Center"
                    },
                    "total_day_cost": 3000
                }
            ],
            "total_cost": preferences['budget'],
            "cultural_insights": [
                f"Explore the rich culture of {preferences['destination']}",
                "Respect local customs and traditions"
            ]
        }
    
    def create_fallback_itinerary(self, preferences):
        """Create a basic fallback itinerary"""
        return {
            "itinerary": [
                {
                    "day": i,
                    "date": (datetime.strptime(preferences['start_date'], '%Y-%m-%d') + timedelta(days=i-1)).strftime('%Y-%m-%d'),
                    "activities": [
                        {
                            "time": "09:00 AM",
                            "activity": f"Day {i} exploration",
                            "location": preferences['destination'],
                            "description": f"Explore {preferences['destination']} on day {i}",
                            "cost": preferences['budget'] // preferences['duration'] // 3,
                            "category": "sightseeing"
                        }
                    ],
                    "total_day_cost": preferences['budget'] // preferences['duration']
                } for i in range(1, preferences['duration'] + 1)
            ],
            "total_cost": preferences['budget'],
            "message": "Basic itinerary generated. For detailed planning, please try again."
        }

    def get_wikipedia_summary(self, destination):
        """Get a summary of the destination from Wikipedia."""
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{destination}"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data.get('extract', 'No summary available.')
        except Exception as e:
            print(f"Error fetching Wikipedia data: {e}")
            return None

    def get_cultural_insights(self, destination):
        """(Conceptual) Fetch cultural data from a knowledge base."""
        # This is a conceptual function. You would replace this with actual
        # database queries or API calls as per the PDF guide.
        # For now, it returns a placeholder.
        # Example: query your Firestore 'cultural_data' collection
        # and search for the destination's festivals and local etiquette.
        return ["Information about local festivals.", "Tips on cultural etiquette."]

    def get_unesco_sites(self, destination):
        """(Conceptual) Fetch UNESCO sites from a knowledge base."""
        # Similar to cultural insights, this would query a database
        # you've populated with UNESCO data from the guide's sources.
        # For now, it returns a placeholder.
        return ["List of UNESCO sites near the destination."]

# Initialize the IntelliTravel AI instance
travel_ai = IntelliTravelAI()

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    """Generate travel itinerary based on user preferences"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['destination', 'duration', 'budget', 'start_date', 'interests']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate itinerary
        itinerary = travel_ai.generate_itinerary(data)
        
        # Save to Firestore
        doc_ref = db.collection('itineraries').document()
        doc_ref.set({
            'user_preferences': data,
            'itinerary': itinerary,
            'created_at': datetime.now(),
            'status': 'generated'
        })
        
        return jsonify({
            'success': True,
            'itinerary': itinerary,
            'itinerary_id': doc_ref.id
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Failed to generate itinerary'}), 500

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    """Get list of popular Indian destinations"""
    destinations = [
        {'name': 'Delhi', 'state': 'Delhi', 'type': 'Historical'},
        {'name': 'Mumbai', 'state': 'Maharashtra', 'type': 'Metropolitan'},
        {'name': 'Goa', 'state': 'Goa', 'type': 'Beach'},
        {'name': 'Jaipur', 'state': 'Rajasthan', 'type': 'Heritage'},
        {'name': 'Kerala', 'state': 'Kerala', 'type': 'Nature'},
        {'name': 'Agra', 'state': 'Uttar Pradesh', 'type': 'Historical'},
        {'name': 'Manali', 'state': 'Himachal Pradesh', 'type': 'Adventure'},
        {'name': 'Rishikesh', 'state': 'Uttarakhand', 'type': 'Spiritual'},
        {'name': 'Udaipur', 'state': 'Rajasthan', 'type': 'Heritage'},
        {'name': 'Darjeeling', 'state': 'West Bengal', 'type': 'Hill Station'}
    ]
    
    return jsonify({'destinations': destinations})

@app.route('/api/itinerary/<itinerary_id>', methods=['GET'])
def get_itinerary(itinerary_id):
    """Get specific itinerary by ID"""
    try:
        doc_ref = db.collection('itineraries').document(itinerary_id)
        doc = doc_ref.get()
        
        if doc.exists:
            return jsonify({
                'success': True,
                'data': doc.to_dict()
            })
        else:
            return jsonify({'error': 'Itinerary not found'}), 404
            
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve itinerary'}), 500

@app.route('/api/book-itinerary', methods=['POST'])
def book_itinerary():
    """Simulate booking process"""
    try:
        data = request.get_json()
        itinerary_id = data.get('itinerary_id')
        booking_details = data.get('booking_details', {})
        
        # Simulate booking process
        booking_id = f"BOOK_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Update itinerary with booking status
        doc_ref = db.collection('itineraries').document(itinerary_id)
        doc_ref.update({
            'booking_id': booking_id,
            'booking_details': booking_details,
            'booking_status': 'confirmed',
            'booked_at': datetime.now()
        })
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'message': 'Booking confirmed successfully!'
        })
        
    except Exception as e:
        return jsonify({'error': 'Booking failed'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'IntelliTravel AI Backend'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

# Deployment Configuration

# app.yaml for Google App Engine
"""
runtime: python39
env: standard

instance_class: F2

env_variables:
  PROJECT_ID: "your-project-id"
  GOOGLE_APPLICATION_CREDENTIALS: "service-account-key.json"

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
"""
