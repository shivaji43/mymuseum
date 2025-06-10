"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  CalendarIcon,
  Heart,
  Share2,
  Coffee,
  Croissant,
  UtensilsCrossed,
  Cake,
  Wine,
  Wifi,
  Car,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getCafes, type Cafe } from "@/lib/data"

const categories = [
  { value: "all", label: "All Categories", icon: UtensilsCrossed },
  { value: "Coffee Shop", label: "Coffee Shops", icon: Coffee },
  { value: "Bakery", label: "Bakeries", icon: Croissant },
  { value: "Bistro", label: "Bistros", icon: UtensilsCrossed },
  { value: "Garden Café", label: "Garden Cafés", icon: Cake },
  { value: "Wine Bar", label: "Wine Bars", icon: Wine },
]

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
]

export default function CafesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedCafe, setSelectedCafe] = useState<(typeof cafes)[0] | null>(null)
  const [partySize, setPartySize] = useState(2)
  const [selectedTime, setSelectedTime] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCafes() {
      try {
        const data = await getCafes()
        setCafes(data)
      } catch (error) {
        console.error("Error fetching cafes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCafes()
  }, [])

  const filteredCafes = cafes
    .filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((cafe) => selectedCategory === "all" || cafe.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.avgPrice - b.avgPrice
        case "price-high":
          return b.avgPrice - a.avgPrice
        case "rating":
          return b.rating - a.rating
        case "featured":
        default:
          return b.featured ? 1 : -1
      }
    })

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category)
    return categoryData?.icon || UtensilsCrossed
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return Wifi
      case "parking":
        return Car
      case "credit cards":
        return CreditCard
      default:
        return UtensilsCrossed
    }
  }

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case "$":
        return "bg-green-100 text-green-800"
      case "$$":
        return "bg-yellow-100 text-yellow-800"
      case "$$$":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="bg-background">Loading...</div>
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cafés & Restaurants</h1>
              <p className="text-muted-foreground">Discover amazing cafés and make reservations</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Coffee className="h-3 w-3" />
                {filteredCafes.length} Cafés Available
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
                placeholder="Search cafés by name, location, or cuisine..."
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

        {/* Cafés Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCafes.map((cafe) => {
            const CategoryIcon = getCategoryIcon(cafe.category)
            return (
              <Card key={cafe.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative">
                  <Image
                    src={cafe.image || "/placeholder.svg"}
                    alt={cafe.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  {cafe.featured && <Badge className="absolute left-3 top-3">Featured</Badge>}
                  <Badge className={`absolute right-3 top-3 ${getPriceRangeColor(cafe.priceRange)}`}>
                    {cafe.priceRange}
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
                      <CardTitle className="line-clamp-1">{cafe.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cafe.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      {cafe.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{cafe.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{cafe.rating}</span>
                      <span className="text-muted-foreground">({cafe.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {cafe.seatingCapacity} seats
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {cafe.highlights.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {cafe.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cafe.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Amenities:</div>
                    <div className="flex flex-wrap gap-1">
                      {cafe.amenities.slice(0, 3).map((amenity) => {
                        const AmenityIcon = getAmenityIcon(amenity)
                        return (
                          <Badge key={amenity} variant="outline" className="text-xs gap-1">
                            <AmenityIcon className="h-3 w-3" />
                            {amenity}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {cafe.openHours}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold">{cafe.cuisine}</div>
                    <div className="text-xs text-muted-foreground">Avg. ₹{cafe.avgPrice} per person</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedCafe(cafe)}>Reserve Table</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Make a Reservation</DialogTitle>
                        <DialogDescription>
                          {selectedCafe?.name} - {selectedCafe?.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                  {selectedDate ? format(selectedDate, "MMM dd") : "Pick date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label>Time</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Party Size</Label>
                          <Select
                            value={partySize.toString()}
                            onValueChange={(value) => setPartySize(Number.parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {num} {num === 1 ? "Person" : "People"}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Special Requests (Optional)</Label>
                          <Textarea
                            placeholder="Any dietary restrictions, seating preferences, or special occasions..."
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Opening Hours</Label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {selectedCafe?.openHours}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Estimated cost for {partySize}</span>
                            <span className="font-medium">₹{selectedCafe ? selectedCafe.avgPrice * partySize : 0}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">*Final bill may vary based on your order</div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full" size="lg" disabled={!selectedDate || !selectedTime}>
                          Confirm Reservation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {filteredCafes.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <Coffee className="h-full w-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No cafés found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or browse all categories</p>
          </div>
        )}
      </div>
    </div>
  )
}
