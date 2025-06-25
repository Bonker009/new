"use client"

import { Building2, Target, Users, Heart, Award, MapPin, Calendar, ArrowRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const stats = [
    { number: "50K+", label: "Happy Tenants", icon: Users },
    { number: "10K+", label: "Properties Listed", icon: Building2 },
    { number: "500+", label: "Cities Covered", icon: MapPin },
    { number: "2023", label: "Founded", icon: Calendar },
  ]

  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Co-Founder",
      bio: "Former VP at PropTech Inc. Passionate about revolutionizing real estate.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Jane Smith",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer with 10+ years in scalable platform development.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Peter Jones",
      role: "Head of Product",
      bio: "Product strategist who led teams at Airbnb and Zillow.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mary Johnson",
      role: "Head of Marketing",
      bio: "Growth marketing expert with experience at top SaaS companies.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ]

  const testimonials = [
    {
      quote: "RentHouse made finding my dream apartment effortless. The process was transparent and stress-free.",
      author: "Sarah Wilson",
      role: "Tenant",
      rating: 5,
    },
    {
      quote: "As a landlord, I've never had such an easy time managing my properties. Highly recommended!",
      author: "Michael Chen",
      role: "Property Owner",
      rating: 5,
    },
    {
      quote: "The customer service is exceptional. They truly care about making the rental experience better.",
      author: "Emily Rodriguez",
      role: "Tenant",
      rating: 5,
    },
  ]

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-amber-100 text-amber-800 hover:bg-amber-200">
            Trusted by 50,000+ renters worldwide
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              RentHouse
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Our mission is to make renting as simple and transparent as buying a coffee. We're building the future of
            rental experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Join Our Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50">
              View Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Our team working together"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Award Winner</div>
                      <div className="text-sm text-slate-600">Best PropTech 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700">
                Our Journey
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Transforming the rental experience
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  RentHouse was born from frustration. Our founders experienced the pain of endless paperwork, hidden
                  fees, and unreliable listings firsthand. They knew there had to be a better way.
                </p>
                <p>
                  What started as a simple idea in a coffee shop has grown into a platform trusted by thousands. We've
                  eliminated the friction from renting, making it transparent, efficient, and even enjoyable.
                </p>
                <p>
                  Today, we're proud to be building a community where tenants find their perfect homes and landlords
                  connect with ideal tenants—all through technology that just works.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-700">Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-orange-700">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-700">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-slate-300">
              What Drives Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Our Mission",
                description:
                  "To create a seamless and trustworthy rental experience for everyone, powered by technology and a commitment to exceptional service.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Target,
                title: "Our Vision",
                description:
                  "To be the most loved and trusted rental platform, making it easy for people to find a place they can call home.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Heart,
                title: "Our Values",
                description:
                  "We believe in integrity, customer-centricity, innovation, and building a positive community for renters and owners alike.",
                color: "from-red-500 to-pink-500",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700">
              Leadership Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Meet the Visionaries</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise from top tech companies and real estate industry leaders.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50"
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h4>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800">
              Customer Love
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What People Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our community has to say about their experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-amber-400 mb-4" />
                  <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Rental Experience?</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Join thousands of satisfied tenants and landlords who have discovered a better way to rent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-400 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
