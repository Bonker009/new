"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  Building,
  Users,
  HelpCircle,
  ChevronDown,
  Send,
  CheckCircle,
  Star,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("general")
  const [formSubmitted, setFormSubmitted] = useState(false)

  const departments = [
    {
      id: "general",
      name: "General Inquiries",
      icon: MessageCircle,
      email: "hello@renthouse.com",
      description: "General questions and information",
    },
    {
      id: "support",
      name: "Customer Support",
      icon: Headphones,
      email: "support@renthouse.com",
      description: "Technical support and account help",
    },
    {
      id: "sales",
      name: "Sales & Partnerships",
      icon: Building,
      email: "sales@renthouse.com",
      description: "Business inquiries and partnerships",
    },
    {
      id: "press",
      name: "Press & Media",
      icon: Globe,
      email: "press@renthouse.com",
      description: "Media inquiries and press releases",
    },
  ]

  const faqs = [
    {
      question: "How do I list my property on RentHouse?",
      answer:
        "You can list your property by creating a landlord account and following our simple 5-step listing process. It takes less than 10 minutes to get started.",
    },
    {
      question: "What fees does RentHouse charge?",
      answer:
        "We believe in transparent pricing. There are no hidden fees for tenants. Landlords pay a small commission only when they successfully rent their property.",
    },
    {
      question: "How do you verify listings?",
      answer:
        "All listings go through our verification process, including photo verification, document checks, and property visits when necessary.",
    },
    {
      question: "Can I schedule property viewings through the platform?",
      answer:
        "Yes! You can schedule viewings directly through our platform. We also offer virtual tours for many properties.",
    },
    {
      question: "What if I have issues with my rental?",
      answer:
        "Our customer support team is available 24/7 to help resolve any issues. We also have a dispute resolution process to ensure fair outcomes.",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    // Handle form submission logic here
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 bg-amber-100 text-amber-800 hover:bg-amber-200">
            We're here to help 24/7
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, our team is
            ready to help you find your perfect rental experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50">
              <Phone className="mr-2 h-4 w-4" />
              Call Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Contact Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">&lt; 2 min</div>
              <div className="text-slate-600 text-sm">Average Response Time</div>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">4.9/5</div>
              <div className="text-slate-600 text-sm">Customer Satisfaction</div>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">24/7</div>
              <div className="text-slate-600 text-sm">Support Available</div>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">98%</div>
              <div className="text-slate-600 text-sm">Issues Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="pb-6">
                  <CardTitle className="text-3xl font-bold text-slate-900">Send us a message</CardTitle>
                  <p className="text-slate-600">Choose your department and we'll get back to you within 2 hours.</p>
                </CardHeader>
                <CardContent>
                  {!formSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Department Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Department</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {departments.map((dept) => (
                            <div
                              key={dept.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                selectedDepartment === dept.id
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              onClick={() => setSelectedDepartment(dept.id)}
                            >
                              <div className="flex items-center gap-3">
                                <dept.icon
                                  className={`w-5 h-5 ${
                                    selectedDepartment === dept.id ? "text-amber-600" : "text-slate-500"
                                  }`}
                                />
                                <div>
                                  <div className="font-medium text-slate-900">{dept.name}</div>
                                  <div className="text-xs text-slate-600">{dept.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                          <Input placeholder="John" className="border-slate-300" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                          <Input placeholder="Doe" className="border-slate-300" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <Input type="email" placeholder="john@example.com" className="border-slate-300" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                        <Input placeholder="How can we help you?" className="border-slate-300" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          className="border-slate-300 resize-none"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h3>
                      <p className="text-slate-600 mb-6">
                        Thank you for reaching out. We'll get back to you within 2 hours during business hours.
                      </p>
                      <Button onClick={() => setFormSubmitted(false)} variant="outline" className="border-slate-300">
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Phone Support</h4>
                      <p className="text-slate-600 mb-2">(123) 456-7890</p>
                      <p className="text-sm text-slate-500">Available 24/7 for urgent matters</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Email Support</h4>
                      <p className="text-slate-600 mb-2">support@renthouse.com</p>
                      <p className="text-sm text-slate-500">Response within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Live Chat</h4>
                      <p className="text-slate-600 mb-2">Available on our website</p>
                      <p className="text-sm text-slate-500">Instant responses during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Visit Our Office</h4>
                      <p className="text-slate-600 mb-2">123 RentHouse St, Suite 100</p>
                      <p className="text-slate-600 mb-2">San Francisco, CA 94103</p>
                      <p className="text-sm text-slate-500">By appointment only</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-amber-600" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-medium text-slate-900">Monday - Friday</span>
                      <span className="text-slate-600">9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-medium text-slate-900">Saturday</span>
                      <span className="text-slate-600">10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-slate-900">Sunday</span>
                      <span className="text-slate-600">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Emergency Support:</strong> Available 24/7 for urgent property issues
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-slate-300">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Quick Answers</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find answers to common questions. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</h3>
                        <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform duration-200" />
                      </summary>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" className="border-slate-300">
                <HelpCircle className="mr-2 h-4 w-4" />
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Visit Our Office</h2>
            <p className="text-xl text-slate-600">
              Located in the heart of San Francisco, we're always happy to meet in person.
            </p>
          </div>
          <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Interactive map would be integrated here</p>
              <p className="text-sm text-slate-500 mt-2">123 RentHouse St, Suite 100, San Francisco, CA 94103</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
