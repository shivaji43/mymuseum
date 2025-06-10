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
  Camera,
  Palette,
  Building,
  Landmark,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getMuseums, type Museum } from "@/lib/data"

// Remove the hardcoded museums array and replace with:
const categories = [
  { value: "all", label: "All Categories", icon: Building },
  { value: "Art", label: "Art Museums", icon: Palette },
  { value: "Science", label: "Science Museums", icon: Camera },
  { value: "History", label: "History Museums", icon: Landmark },
]

export default function MuseumsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [museums, setMuseums] = useState<Museum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMuseums() {
      try {
        const data = await getMuseums()
        setMuseums(data)
      } catch (error) {
        console.error("Error fetching museums:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMuseums()
  }, [])

  // Update the filteredMuseums logic to use the museums state:
  const filteredMuseums = museums
    .filter(
      (museum) =>
        museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        museum.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((museum) => selectedCategory === "all" || museum.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "featured":
        default:
          return b.featured ? 1 : -1
      }
    })

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category)
    return categoryData?.icon || Building
  }

  // Add loading state in the render:
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
              <h1 className="text-3xl font-bold tracking-tight">Museums & Exhibitions</h1>
              <p className="text-muted-foreground">Discover world-class museums and book your visit</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Ticket className="h-3 w-3" />
                {filteredMuseums.length} Museums Available
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
                placeholder="Search museums by name or location..."
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

        {/* Museums Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMuseums.map((museum) => {
            const CategoryIcon = getCategoryIcon(museum.category)
            return (
              <Card key={museum.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative">
                  <Image
                    src={museum.image || "/placeholder.svg"}
                    alt={museum.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  {museum.featured && <Badge className="absolute left-3 top-3">Featured</Badge>}
                  <div className="absolute right-3 top-3 flex gap-2">
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
                      <CardTitle className="line-clamp-1">{museum.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {museum.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <CategoryIcon className="h-3 w-3" />
                      {museum.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{museum.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{museum.rating}</span>
                      <span className="text-muted-foreground">({museum.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {museum.duration}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {museum.highlights.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {museum.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{museum.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">₹{museum.price}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedMuseum(museum)}>Book Now</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Book Your Visit</DialogTitle>
                        <DialogDescription>
                          {selectedMuseum?.name} - {selectedMuseum?.location}
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
                          <Label>Museum Hours</Label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {selectedMuseum?.openHours}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total</span>
                          <span className="text-2xl font-bold">
                            ₹{selectedMuseum ? selectedMuseum.price * ticketQuantity : 0}
                          </span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full" size="lg">
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {filteredMuseums.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <Building className="h-full w-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No museums found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or browse all categories</p>
          </div>
        )}
      </div>
    </div>
  )
}
