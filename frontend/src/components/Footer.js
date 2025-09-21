import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-20 px-6 mt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-red-900"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Newsletter Section */}
        <Card className="backdrop-blur-lg bg-amber-100/20 border border-amber-200/30 mb-16">
          <CardContent className="p-12 text-center">
            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300 mb-4">
              ✈️ Stay Updated
            </Badge>
            <h3 className="text-3xl font-bold text-white mb-4">
              Get Travel Inspiration & Exclusive Deals
            </h3>
            <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest Indian travel trends, AI-curated destinations, and special offers just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-amber-200 focus:outline-none focus:border-amber-400"
              />
              <button className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
              <div className="text-xl font-bold text-white">
                IntelliTravel AI
              </div>
            </div>
            <p className="text-amber-200 leading-relaxed">
              Transforming the way Indians explore their incredible country with AI-powered travel planning and cultural intelligence.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-3">
              {['Popular Destinations', 'AI Features', 'Pricing', 'How it Works', 'Success Stories', 'Travel Blog'].map(link => (
                <a key={link} href="#" className="block text-amber-200 hover:text-amber-100 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Top Destinations</h4>
            <div className="space-y-3">
              {['Rajasthan Heritage', 'Kerala Backwaters', 'Himalayan Adventures', 'Goa Beaches', 'Golden Triangle', 'South India Temple'].map(dest => (
                <a key={dest} href="#" className="block text-amber-200 hover:text-white transition-colors">
                  {dest}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-200">123 Tech Hub</p>
                  <p className="text-amber-200">Bangalore, Karnataka 560001</p>
                  <p className="text-amber-200">India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400" />
                <span className="text-amber-200">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-amber-200">hello@intellitravel.ai</span>
              </div>
            </div>

            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-2">24/7 Support</h5>
              <p className="text-amber-200 text-sm">
                Get instant help via WhatsApp, chat, or call for any travel emergency or query.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-amber-300 text-sm">
              © 2024 IntelliTravel AI. All rights reserved. Proudly made in India 🇮🇳
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-amber-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-amber-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-amber-300 hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-amber-300 hover:text-white transition-colors">GDPR</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
