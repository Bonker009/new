"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Building2,
  Search,
  Heart,
  DollarSign,
  Users,
  ArrowRight,
  Star,
  MapPin,
  Bed,
  Bath,
  Square,
  Shield,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Home,
  Zap,
  Globe,
  Smartphone,
} from "lucide-react"

export default function RentHouse() {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPropertyType, setSelectedPropertyType] = useState("all")

  const testimonials = [
    {
      quote:
        "RentHouse made finding my dream apartment effortless. The verification process gave me confidence, and the support team was incredible throughout the entire journey.",
      author: "Sarah Johnson",
      role: "Marketing Manager",
      location: "San Francisco, CA",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "As a property owner, I've never had such an easy time managing my rentals. The platform handles everything seamlessly, and I've had zero vacancy since joining.",
      author: "Michael Chen",
      role: "Property Investor",
      location: "Austin, TX",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "The customer service is exceptional. When I had questions about my lease, they responded within minutes and resolved everything perfectly. Highly recommended!",
      author: "Emily Rodriguez",
      role: "Software Engineer",
      location: "Seattle, WA",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ]

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath = user.role === "OWNER" ? "/owner/dashboard" : "/user/dashboard"
      router.push(dashboardPath)
    }
  }, [isAuthenticated, isLoading, user, router])

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Finding your perfect home...</h3>
          <p className="text-slate-600">Please wait while we prepare your experience</p>
        </div>
      </div>
    )
  }

  const featuredProperties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      title: "Modern Downtown Apartment",
      location: "Downtown District",
      price: "$1,200",
      originalPrice: "$1,400",
      beds: 2,
      baths: 2,
      sqft: "850",
      rating: 4.8,
      reviews: 124,
      type: "apartment",
      featured: true,
      amenities: ["Gym", "Pool", "Parking"],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      title: "Cozy Suburban House",
      location: "Green Valley",
      price: "$1,800",
      beds: 3,
      baths: 2,
      sqft: "1,200",
      rating: 4.9,
      reviews: 89,
      type: "house",
      featured: false,
      amenities: ["Garden", "Garage", "Fireplace"],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      title: "Luxury Penthouse Suite",
      location: "Skyline Heights",
      price: "$2,500",
      beds: 2,
      baths: 3,
      sqft: "1,100",
      rating: 5.0,
      reviews: 67,
      type: "penthouse",
      featured: true,
      amenities: ["Concierge", "Rooftop", "City View"],
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      title: "Student Studio",
      location: "University Area",
      price: "$800",
      beds: 1,
      baths: 1,
      sqft: "450",
      rating: 4.6,
      reviews: 156,
      type: "studio",
      featured: false,
      amenities: ["WiFi", "Laundry", "Study Room"],
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Tenants", icon: Users, color: "from-blue-500 to-blue-600" },
    { number: "15K+", label: "Properties Listed", icon: Building2, color: "from-green-500 to-green-600" },
    { number: "99%", label: "Satisfaction Rate", icon: Award, color: "from-purple-500 to-purple-600" },
    { number: "24/7", label: "Support Available", icon: Clock, color: "from-amber-500 to-amber-600" },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All listings are verified and inspected for quality and safety standards",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "AI-powered search with advanced filters to find your perfect match",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees or surprises. Clear pricing with detailed breakdowns",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time market data, price trends, and neighborhood analytics",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book viewings and secure properties instantly with our fast process",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Fully optimized mobile experience for searching on the go",
      color: "from-indigo-500 to-blue-500",
    },
  ]

  const propertyTypes = [
    { id: "all", label: "All Properties", count: "15K+" },
    { id: "apartment", label: "Apartments", count: "8K+" },
    { id: "house", label: "Houses", count: "4K+" },
    { id: "studio", label: "Studios", count: "2K+" },
    { id: "penthouse", label: "Penthouses", count: "500+" },
  ]

  const filteredProperties =
    selectedPropertyType === "all"
      ? featuredProperties
      : featuredProperties.filter((property) => property.type === selectedPropertyType)

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 px-6 py-3 text-sm font-medium">
                  🏠 Trusted by 50,000+ renters worldwide
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-slate-900">Find Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Dream Home
                  </span>
                  <br />
                  <span className="text-slate-900">Today</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Connect with verified property owners and discover your perfect rental. From cozy studios to luxury
                  penthouses, we have the largest selection of quality homes.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Enter location, neighborhood, or property name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-3 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm text-slate-600">Popular:</span>
                  {["Downtown", "Near Metro", "Pet Friendly", "Furnished"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-slate-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Search
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600">Happy Tenants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">15K+</div>
                  <div className="text-sm text-slate-600">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">4.9★</div>
                  <div className="text-sm text-slate-600">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <img
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=320&h=280&fit=crop"
                      alt="Modern apartment"
                      className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative group">
                    <img
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&h=220&fit=crop"
                      alt="Cozy living room"
                      className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="relative group">
                    <img
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=320&h=220&fit=crop"
                      alt="Beautiful kitchen"
                      className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative group">
                    <img
                      src="https://images.unsplash.com/photo-1560448204-6032e02f83b4?w=320&h=280&fit=crop"
                      alt="Luxury bedroom"
                      className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900">Available Now</span>
                    <div className="text-xs text-slate-600">Move-in ready</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">$1,200</div>
                  <div className="text-sm text-slate-600">per month</div>
                  <div className="text-xs text-green-600 font-medium">Best Price</div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <span className="text-lg font-bold text-slate-900">4.9</span>
                  <span className="text-sm text-slate-600">(2.1k reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Property Type Filter */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {propertyTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedPropertyType === type.id ? "default" : "outline"}
                onClick={() => setSelectedPropertyType(type.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedPropertyType === type.id
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type.label}
                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
                  {type.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Properties */}
      <section id="properties" className="py-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700">
              Handpicked Selection
            </Badge>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Featured Properties</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover carefully curated properties that offer the perfect blend of comfort, location, and exceptional
              value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">Featured</Badge>
                    )}
                    {property.originalPrice && <Badge className="bg-green-500 text-white">Deal</Badge>}
                  </div>

                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/90 hover:bg-white text-slate-700 rounded-full p-2 backdrop-blur-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-white/90 text-slate-900 hover:bg-white">
                        <Calendar className="w-4 h-4 mr-1" />
                        Tour
                      </Button>
                      <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-slate-700">{property.rating}</span>
                        <span className="text-xs text-slate-500">({property.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">{property.price}</span>
                          {property.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">{property.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-slate-600 text-sm">per month</span>
                      </div>
                      <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50 px-12 py-4 rounded-xl"
            >
              View All{" "}
              {selectedPropertyType === "all"
                ? "Properties"
                : propertyTypes.find((t) => t.id === selectedPropertyType)?.label}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-slate-300">Join our growing community of satisfied users</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white group">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-slate-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700">
              Why Choose Us
            </Badge>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">The RentHouse Advantage</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We've revolutionized the rental experience with cutting-edge technology and unmatched service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <benefit.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800">
              Customer Stories
            </Badge>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">What Our Users Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our community has to say about their experience
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center">
                  <Quote className="w-16 h-16 text-amber-400 mx-auto mb-8" />
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-2xl text-slate-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].author}
                      className="w-16 h-16 rounded-full shadow-lg"
                    />
                    <div className="text-left">
                      <div className="font-bold text-slate-900 text-lg">{testimonials[currentTestimonial].author}</div>
                      <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
                      <div className="text-sm text-slate-500">{testimonials[currentTestimonial].location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? "bg-amber-600 w-8" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              Ready to Get Started?
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Your Perfect Home is Just One Click Away
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied tenants and property owners who have discovered a better way to rent with
              RentHouse
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6">For Tenants</h3>
                  <ul className="space-y-3 text-slate-300 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Browse 15,000+ verified properties</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Save favorites & get instant alerts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Secure payments & digital contracts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                  <Link href="/auth/register">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 text-lg font-semibold">
                      <Home className="w-5 h-5 mr-2" />
                      Find Your Home
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6">For Property Owners</h3>
                  <ul className="space-y-3 text-slate-300 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>List unlimited properties for free</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Advanced property management tools</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Real-time analytics & insights</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Automated rent collection</span>
                    </li>
                  </ul>
                  <Link href="/auth/register">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 text-lg font-semibold">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Start Earning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-12 py-4 text-lg font-semibold"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-12 py-4 text-lg font-semibold"
              >
                <Globe className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
