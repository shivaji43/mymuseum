import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  Theater,
  Coffee,
  Bot,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Heart,
  Shield,
  Zap,
} from "lucide-react"

const features = [
  {
    title: "Museums",
    description: "Explore India&apos;s rich heritage through world-class museums and exhibitions",
    icon: Building,
    href: "/museums",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    stats: "25+ Museums",
    details: "From ancient Harappan artifacts to contemporary art collections",
  },
  {
    title: "Shows",
    description: "Experience the vibrant performing arts scene across India",
    icon: Theater,
    href: "/shows",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    stats: "25+ Shows",
    details: "Classical dance, theater, comedy, and musical performances",
  },
  {
    title: "Cafés",
    description: "Discover authentic Indian flavors and contemporary dining experiences",
    icon: Coffee,
    href: "/cafes",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
    stats: "25+ Cafés",
    details: "From heritage Irani cafes to modern specialty coffee roasters",
  },
]

const highlights = [
  {
    title: "National Museum of India",
    location: "New Delhi, Delhi",
    rating: 4.8,
    type: "History Museum",
    price: "₹500",
    image: "/placeholder.svg?height=200&width=300&text=National+Museum+India",
    description: "India&apos;s premier cultural institution with 5,000 years of heritage",
    highlights: ["Harappan Gallery", "Mughal Miniatures", "Buddhist Art"],
  },
  {
    title: "Mughal-e-Azam: The Musical",
    location: "New Delhi, Delhi",
    rating: 4.9,
    type: "Musical Theater",
    price: "₹2,500",
    image: "/placeholder.svg?height=200&width=300&text=Mughal+e+Azam",
    description: "Grand musical adaptation of the classic Bollywood film",
    highlights: ["Live Orchestra", "Spectacular Sets", "Classical Dance"],
  },
  {
    title: "Blue Tokai Coffee Roasters",
    location: "New Delhi, Delhi",
    rating: 4.7,
    type: "Specialty Coffee",
    price: "₹600",
    image: "/placeholder.svg?height=200&width=300&text=Blue+Tokai+Coffee",
    description: "Single-origin Indian coffees in artistic space",
    highlights: ["Pour Overs", "Artisanal Pastries", "Coffee Workshops"],
  },
]

const cities = [
  {
    name: "New Delhi",
    count: "15+ Venues",
    description: "Capital&apos;s cultural heart",
    image: "/placeholder.svg?height=150&width=200&text=New+Delhi",
  },
  {
    name: "Mumbai",
    count: "12+ Venues",
    description: "Entertainment capital",
    image: "/placeholder.svg?height=150&width=200&text=Mumbai",
  },
  {
    name: "Kolkata",
    count: "8+ Venues",
    description: "Cultural heritage city",
    image: "/placeholder.svg?height=150&width=200&text=Kolkata",
  },
  {
    name: "Bangalore",
    count: "10+ Venues",
    description: "Modern cultural hub",
    image: "/placeholder.svg?height=150&width=200&text=Bangalore",
  },
]

const stats = [
  {
    number: "75+",
    label: "Cultural Venues",
    description: "Across major Indian cities",
  },
  {
    number: "50K+",
    label: "Happy Visitors",
    description: "Cultural experiences booked",
  },
  {
    number: "4.8★",
    label: "Average Rating",
    description: "From satisfied customers",
  },
  {
    number: "15+",
    label: "Indian Cities",
    description: "Cultural destinations covered",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book tickets and reserve tables in seconds with our streamlined process",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and secure payment processing with multiple payment options",
  },
  {
    icon: Heart,
    title: "Curated Experiences",
    description: "Hand-picked venues and shows for the best cultural experiences",
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "Real reviews from fellow culture enthusiasts to guide your choices",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "MyMuseum made it so easy to discover and book cultural experiences. The AI recommendations were spot on!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    text: "Found amazing heritage cafes and classical performances I never knew existed. Highly recommended!",
    rating: 5,
  },
  {
    name: "Anita Desai",
    location: "Bangalore",
    text: "The booking process is seamless and the venue information is comprehensive. Love the muBuddy AI assistant!",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="h-3 w-3" />
              Welcome to MyMuseum
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Discover India&apos;s Rich
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                Cultural Heritage
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Explore India&apos;s magnificent museums, experience vibrant performing arts, and savor authentic flavors at
              heritage cafés. Your journey through India&apos;s cultural landscape starts here.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2">
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Bot className="h-4 w-4" />
                Try muBuddy AI
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary md:text-3xl">{stat.number}</div>
                  <div className="text-sm font-medium">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Explore India&apos;s Cultural Treasures</h2>
            <p className="text-muted-foreground">
              From ancient artifacts to contemporary performances, discover the diverse cultural landscape of India
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="group transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`rounded-lg p-2 ${feature.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">{feature.stats}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                      <CardDescription className="mb-2">{feature.description}</CardDescription>
                      <p className="text-xs text-muted-foreground">{feature.details}</p>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-secondary">
                        Explore {feature.title}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Explore Cultural Cities</h2>
            <p className="text-muted-foreground">Discover cultural experiences across India&apos;s most vibrant cities</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cities.map((city, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg group">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.description}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{city.count}</Badge>
                    <Button variant="ghost" size="sm" className="group-hover:bg-secondary">
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Featured Cultural Experiences</h2>
            <p className="text-muted-foreground">
              Hand-picked recommendations showcasing India&apos;s finest cultural offerings
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg group">
                <div className="aspect-video bg-muted relative">
                  <Badge className="absolute left-3 top-3 z-10">{item.type}</Badge>
                  <div className="absolute right-3 top-3 z-10">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">{item.price}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.highlights.map((highlight) => (
                        <Badge key={highlight} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose MyMuseum?</h2>
            <p className="text-muted-foreground">
              Experience the best of India&apos;s culture with our comprehensive platform
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center p-6 transition-all hover:shadow-lg">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">What Our Users Say</h2>
            <p className="text-muted-foreground">Join thousands of culture enthusiasts who trust MyMuseum</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground italic">{testimonial.text}</p>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* muBuddy Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-medium">Introducing muBuddy</span>
              <Badge variant="secondary" className="text-xs">
                AI Powered
              </Badge>
            </div>
            <h2 className="mb-4 text-3xl font-bold">Your AI Cultural Companion</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Get personalized recommendations based on your interests, plan your cultural itinerary, and discover
              hidden gems across India. muBuddy learns your preferences to suggest the perfect cultural experiences
              tailored just for you.
            </p>

            <div className="mb-8 grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Itinerary Planning</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Clock className="h-4 w-4 text-primary" />
                <span>24/7 Assistance</span>
              </div>
            </div>

            <Button size="lg" className="gap-2">
              <Bot className="h-4 w-4" />
              Chat with muBuddy
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Explore India&apos;s Culture?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of culture enthusiasts and start your journey through India&apos;s rich heritage today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2">
                <Building className="h-4 w-4" />
                Explore Museums
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Theater className="h-4 w-4" />
                Book Shows
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Coffee className="h-4 w-4" />
                Find Cafés
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}