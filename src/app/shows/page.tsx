"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  CalendarIcon,
  Heart,
  Share2,
  Ticket,
  Music,
  Theater,
  Mic,
  Palette,
  PartyPopper,
  Volume2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getShows, type Show } from "@/lib/data"
import Script from "next/script"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "all", label: "All Shows", icon: Theater },
  { value: "Musical", label: "Musicals", icon: Music },
  { value: "Comedy", label: "Comedy", icon: Mic },
  { value: "Classical", label: "Classical", icon: Volume2 },
  { value: "Concert", label: "Concerts", icon: PartyPopper },
  { value: "Theater", label: "Theater", icon: Theater },
  { value: "Jazz", label: "Jazz", icon: Palette },
]

export default function ShowsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedShow, setSelectedShow] = useState<(typeof shows)[0] | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(2)
  const [selectedShowtime, setSelectedShowtime] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Remove the hardcoded shows array and replace with:
  const [shows, setShows] = useState<Show[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    async function fetchShows() {
      try {
        const data = await getShows()
        setShows(data)
        
        // Check for booking parameters from chat interface
        const bookingId = searchParams.get('bookingId')
        if (bookingId) {
          const showId = parseInt(bookingId)
          const foundShow = data.find(s => s.id === showId)
          
          if (foundShow) {
            setSelectedShow(foundShow)
            
            // Handle date parameter
            const dateParam = searchParams.get('date')
            if (dateParam) {
              try {
                const bookingDate = new Date(dateParam)
                if (!isNaN(bookingDate.getTime())) {
                  setSelectedDate(bookingDate)
                }
              } catch (e) {
                console.error("Invalid date format from URL params", e)
              }
            }
            
            // Handle quantity parameter
            const quantityParam = searchParams.get('quantity')
            if (quantityParam) {
              const parsedQuantity = parseInt(quantityParam)
              if (!isNaN(parsedQuantity) && parsedQuantity > 0 && parsedQuantity <= 8) {
                setTicketQuantity(parsedQuantity)
              }
            }
            
            // Handle showtime parameter
            const showtimeParam = searchParams.get('showtime')
            if (showtimeParam && foundShow.showtimes && foundShow.showtimes.includes(showtimeParam)) {
              setSelectedShowtime(showtimeParam)
            }
            
            // Auto-open the booking dialog
            document.getElementById('booking-dialog-trigger')?.click()
          }
        }
      } catch (error) {
        console.error("Error fetching shows:", error)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchShows()
  }, [searchParams])

  // Update the filteredShows logic to use the shows state:
  const filteredShows = shows
    .filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((show) => selectedCategory === "all" || show.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.ticketPrice - b.ticketPrice
        case "price-high":
          return b.ticketPrice - a.ticketPrice
        case "rating":
          return b.rating - a.rating
        case "featured":
        default:
          return b.featured ? 1 : -1
      }
    })

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category)
    return categoryData?.icon || Theater
  }

  const getAgeRatingColor = (ageRating: string) => {
    switch (ageRating) {
      case "All Ages":
        return "bg-green-100 text-green-800"
      case "PG-13":
        return "bg-yellow-100 text-yellow-800"
      case "18+":
        return "bg-orange-100 text-orange-800"
      case "21+":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Add loading state in the render:
  // Handle payment process
  const handlePayment = async () => {
    if (!selectedDate || !selectedShowtime || !selectedShow) {
      toast({
        title: "Missing Information",
        description: "Please select a date and showtime.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create order on the server
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedShow.ticketPrice * ticketQuantity,
          currency: 'INR',
          receipt: `show-${selectedShow.id}-${Date.now()}`,
          notes: {
            showId: selectedShow.id,
            showName: selectedShow.name,
            date: selectedDate.toISOString(),
            showtime: selectedShowtime,
            ticketQuantity: ticketQuantity,
            venue: selectedShow.venue,
          }
        }),
      })

      const order = await orderResponse.json()
      
      if (!order.id) {
        throw new Error(order.error || 'Failed to create order');
      }

      // Load Razorpay checkout
      const options = {
        key: "rzp_test_RhbGZCRx4MVEJU", // Replace with your actual key when going to production
        amount: order.amount,
        currency: order.currency,
        name: "Museum Experience",
        description: `Tickets for ${selectedShow.name}`,
        order_id: order.id,
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          showId: selectedShow.id,
          showName: selectedShow.name,
          date: selectedDate.toISOString(),
          showtime: selectedShowtime,
          ticketQuantity: ticketQuantity,
        },
        theme: {
          color: "#3B82F6",
        },
        callback_url: `${window.location.origin}/payment-success`,
      };

      const razorpay = (window as any).Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading && !selectedShow) {
    return <div className="bg-background">Loading...</div>
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shows & Events</h1>
              <p className="text-muted-foreground">Discover amazing shows and book your tickets</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Ticket className="h-3 w-3" />
                {filteredShows.length} Shows Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shows by name, venue, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shows Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShows.map((show) => {
            const CategoryIcon = getCategoryIcon(show.category)
            return (
              <Card key={show.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative">
                  <Image
                    src={show.image || "/placeholder.svg"}
                    alt={show.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  {show.featured && <Badge className="absolute left-3 top-3">Featured</Badge>}
                  <Badge className={`absolute right-3 top-3 ${getAgeRatingColor(show.ageRating)}`}>
                    {show.ageRating}
                  </Badge>
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1">{show.name}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Theater className="h-3 w-3" />
                          {show.venue}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {show.location}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      {show.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{show.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{show.rating}</span>
                      <span className="text-muted-foreground">({show.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {show.duration}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {show.highlights.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {show.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{show.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Showtimes:</div>
                    <div className="flex flex-wrap gap-1">
                      {show.showtimes.map((time) => (
                        <Badge key={time} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{show.ticketPrice === 0 ? "FREE" : `₹${show.ticketPrice}`}</div>
                    <div className="text-xs text-muted-foreground">per ticket</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        id={show.id === selectedShow?.id ? 'booking-dialog-trigger' : ''}
                        variant="secondary" 
                        onClick={() => setSelectedShow(show)}
                      >
                        Purchase Tickets
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Book Your Tickets</DialogTitle>
                        <DialogDescription>
                          {selectedShow?.name} at {selectedShow?.venue}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !selectedDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Select Showtime</Label>
                          <Select value={selectedShowtime} onValueChange={setSelectedShowtime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose showtime" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedShow?.showtimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {time}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Number of Tickets</Label>
                          <Select
                            value={ticketQuantity.toString()}
                            onValueChange={(value) => setTicketQuantity(Number.parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {num} {num === 1 ? "Ticket" : "Tickets"}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Show Details</Label>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Duration: {selectedShow?.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Age Rating: {selectedShow?.ageRating}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total</span>
                          <span className="text-2xl font-bold">
                            {selectedShow?.ticketPrice === 0
                              ? "FREE"
                              : `₹${selectedShow ? selectedShow.ticketPrice * ticketQuantity : 0}`}
                          </span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          className="w-full" 
                          size="lg" 
                          disabled={!selectedDate || !selectedShowtime || loading}
                          onClick={handlePayment}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            selectedShow?.ticketPrice === 0 ? "Reserve Seats" : "Purchase Tickets"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {filteredShows.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <Theater className="h-full w-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No shows found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or browse all categories</p>
          </div>
        )}
      </div>
      
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </div>
  )
}