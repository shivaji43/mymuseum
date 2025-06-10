// Import JSON data with proper typing
import museumsData from "./data/museums.json"
import cafesData from "./data/cafes.json"
import showsData from "./data/shows.json"

export interface Museum {
  id: number
  name: string
  location: string
  category: string
  rating: number
  reviews: number
  price: number
  image: string
  description: string
  duration: string
  highlights: string[]
  openHours: string
  featured: boolean
  city: string
  state: string
  established: number
  website: string
  contactNumber: string
  specialExhibitions: string[]
  facilities: string[]
}

export interface Cafe {
  id: number
  name: string
  location: string
  category: string
  rating: number
  reviews: number
  priceRange: string
  avgPrice: number
  image: string
  description: string
  cuisine: string
  seatingCapacity: number
  highlights: string[]
  openHours: string
  amenities: string[]
  featured: boolean
  city: string
  state: string
  established: number
  website: string
  contactNumber: string
  specialMenu: string[]
  paymentOptions: string[]
}

export interface Show {
  id: number
  name: string
  venue: string
  location: string
  category: string
  rating: number
  reviews: number
  ticketPrice: number
  image: string
  description: string
  duration: string
  ageRating: string
  highlights: string[]
  showtimes: string[]
  availableDates: string[]
  featured: boolean
  city: string
  state: string
  language: string
  director: string
  cast: string[]
  genre: string
  ticketTypes: string[]
  bookingUrl: string
}

// Type the imported JSON data
const typedMuseumsData = museumsData as { museums: Museum[] }
const typedCafesData = cafesData as { cafes: Cafe[] }
const typedShowsData = showsData as { shows: Show[] }

// Museums API
export async function getMuseums(): Promise<Museum[]> {
  try {
    return typedMuseumsData.museums || []
  } catch (error) {
    console.error("Error loading museums:", error)
    return []
  }
}

export async function getMuseumById(id: number): Promise<Museum | undefined> {
  const museums = await getMuseums()
  return museums.find((museum) => museum.id === id)
}

export async function getMuseumsByCategory(category: string): Promise<Museum[]> {
  const museums = await getMuseums()
  if (category.toLowerCase() === "all") return museums
  return museums.filter((museum) => museum.category.toLowerCase() === category.toLowerCase())
}

export async function getFeaturedMuseums(): Promise<Museum[]> {
  const museums = await getMuseums()
  return museums.filter((museum) => museum.featured === true)
}

// Cafes API
export async function getCafes(): Promise<Cafe[]> {
  try {
    return typedCafesData.cafes || []
  } catch (error) {
    console.error("Error loading cafes:", error)
    return []
  }
}

export async function getCafeById(id: number): Promise<Cafe | undefined> {
  const cafes = await getCafes()
  return cafes.find((cafe) => cafe.id === id)
}

export async function getCafesByCategory(category: string): Promise<Cafe[]> {
  const cafes = await getCafes()
  if (category.toLowerCase() === "all") return cafes
  return cafes.filter((cafe) => cafe.category.toLowerCase() === category.toLowerCase())
}

export async function getFeaturedCafes(): Promise<Cafe[]> {
  const cafes = await getCafes()
  return cafes.filter((cafe) => cafe.featured === true)
}

// Shows API
export async function getShows(): Promise<Show[]> {
  try {
    return typedShowsData.shows || []
  } catch (error) {
    console.error("Error loading shows:", error)
    return []
  }
}

export async function getShowById(id: number): Promise<Show | undefined> {
  const shows = await getShows()
  return shows.find((show) => show.id === id)
}

export async function getShowsByCategory(category: string): Promise<Show[]> {
  const shows = await getShows()
  if (category.toLowerCase() === "all") return shows
  return shows.filter((show) => show.category.toLowerCase() === category.toLowerCase())
}

export async function getFeaturedShows(): Promise<Show[]> {
  const shows = await getShows()
  return shows.filter((show) => show.featured === true)
}

// Search functions
export async function searchMuseums(query: string): Promise<Museum[]> {
  const museums = await getMuseums()
  const lowercaseQuery = query.toLowerCase().trim()
  
  if (!lowercaseQuery) return museums // Return all if query is empty
  
  return museums.filter(
    (museum) =>
      museum.name.toLowerCase().includes(lowercaseQuery) ||
      museum.location.toLowerCase().includes(lowercaseQuery) ||
      museum.description.toLowerCase().includes(lowercaseQuery) ||
      museum.city.toLowerCase().includes(lowercaseQuery) ||
      museum.state.toLowerCase().includes(lowercaseQuery) ||
      museum.category.toLowerCase().includes(lowercaseQuery) ||
      museum.highlights.some(h => h.toLowerCase().includes(lowercaseQuery)) ||
      museum.specialExhibitions.some(e => e.toLowerCase().includes(lowercaseQuery))
  )
}

export async function searchCafes(query: string): Promise<Cafe[]> {
  const cafes = await getCafes()
  const lowercaseQuery = query.toLowerCase().trim()
  
  if (!lowercaseQuery) return cafes // Return all if query is empty
  
  return cafes.filter(
    (cafe) =>
      cafe.name.toLowerCase().includes(lowercaseQuery) ||
      cafe.location.toLowerCase().includes(lowercaseQuery) ||
      cafe.description.toLowerCase().includes(lowercaseQuery) ||
      cafe.cuisine.toLowerCase().includes(lowercaseQuery) ||
      cafe.city.toLowerCase().includes(lowercaseQuery) ||
      cafe.state.toLowerCase().includes(lowercaseQuery) ||
      cafe.category.toLowerCase().includes(lowercaseQuery) ||
      cafe.highlights.some(h => h.toLowerCase().includes(lowercaseQuery)) ||
      cafe.specialMenu.some(m => m.toLowerCase().includes(lowercaseQuery))
  )
}

export async function searchShows(query: string): Promise<Show[]> {
  const shows = await getShows()
  const lowercaseQuery = query.toLowerCase().trim()
  
  if (!lowercaseQuery) return shows // Return all if query is empty
  
  return shows.filter(
    (show) =>
      show.name.toLowerCase().includes(lowercaseQuery) ||
      show.venue.toLowerCase().includes(lowercaseQuery) ||
      show.location.toLowerCase().includes(lowercaseQuery) ||
      show.description.toLowerCase().includes(lowercaseQuery) ||
      show.city.toLowerCase().includes(lowercaseQuery) ||
      show.state.toLowerCase().includes(lowercaseQuery) ||
      show.genre.toLowerCase().includes(lowercaseQuery) ||
      show.category.toLowerCase().includes(lowercaseQuery) ||
      show.language.toLowerCase().includes(lowercaseQuery) ||
      show.cast.some(c => c.toLowerCase().includes(lowercaseQuery))
  )
}

// Get cafes by city - handles variations like "Delhi" and "New Delhi"
export async function getCafesByCity(city: string): Promise<Cafe[]> {
  const cafes = await getCafes()
  const searchCity = city.toLowerCase()
  return cafes.filter(cafe => {
    const cafeCity = cafe.city.toLowerCase()
    // Handle variations like "New Delhi" when searching for "Delhi"
    return cafeCity === searchCity || 
           cafeCity.includes(searchCity) || 
           searchCity.includes(cafeCity)
  })
}

// Get museums by city - handles variations
export async function getMuseumsByCity(city: string): Promise<Museum[]> {
  const museums = await getMuseums()
  const searchCity = city.toLowerCase()
  return museums.filter(museum => {
    const museumCity = museum.city.toLowerCase()
    return museumCity === searchCity || 
           museumCity.includes(searchCity) || 
           searchCity.includes(museumCity)
  })
}

// Get shows by city - handles variations
export async function getShowsByCity(city: string): Promise<Show[]> {
  const shows = await getShows()
  const searchCity = city.toLowerCase()
  return shows.filter(show => {
    const showCity = show.city.toLowerCase()
    return showCity === searchCity || 
           showCity.includes(searchCity) || 
           searchCity.includes(showCity)
  })
}

// Get unique cities and states
export async function getMuseumCities(): Promise<string[]> {
  const museums = await getMuseums()
  const cities = [...new Set(museums.map((museum) => museum.city))]
  return cities.sort()
}

export async function getCafeCities(): Promise<string[]> {
  const cafes = await getCafes()
  const cities = [...new Set(cafes.map((cafe) => cafe.city))]
  return cities.sort()
}

export async function getShowCities(): Promise<string[]> {
  const shows = await getShows()
  const cities = [...new Set(shows.map((show) => show.city))]
  return cities.sort()
}

// Get venues by price range
export async function getMuseumsByPriceRange(minPrice: number, maxPrice: number): Promise<Museum[]> {
  const museums = await getMuseums()
  return museums.filter(m => m.price >= minPrice && m.price <= maxPrice)
}

export async function getCafesByPriceRange(minPrice: number, maxPrice: number): Promise<Cafe[]> {
  const cafes = await getCafes()
  return cafes.filter(c => c.avgPrice >= minPrice && c.avgPrice <= maxPrice)
}

export async function getShowsByPriceRange(minPrice: number, maxPrice: number): Promise<Show[]> {
  const shows = await getShows()
  return shows.filter(s => s.ticketPrice >= minPrice && s.ticketPrice <= maxPrice)
}

// Get venues by state
export async function getMuseumsByState(state: string): Promise<Museum[]> {
  const museums = await getMuseums()
  return museums.filter(museum => museum.state.toLowerCase() === state.toLowerCase())
}

export async function getCafesByState(state: string): Promise<Cafe[]> {
  const cafes = await getCafes()
  return cafes.filter(cafe => cafe.state.toLowerCase() === state.toLowerCase())
}

export async function getShowsByState(state: string): Promise<Show[]> {
  const shows = await getShows()
  return shows.filter(show => show.state.toLowerCase() === state.toLowerCase())
}

// Get unique states
export async function getMuseumStates(): Promise<string[]> {
  const museums = await getMuseums()
  const states = [...new Set(museums.map((museum) => museum.state))]
  return states.sort()
}

export async function getCafeStates(): Promise<string[]> {
  const cafes = await getCafes()
  const states = [...new Set(cafes.map((cafe) => cafe.state))]
  return states.sort()
}

export async function getShowStates(): Promise<string[]> {
  const shows = await getShows()
  const states = [...new Set(shows.map((show) => show.state))]
  return states.sort()
}

// Get all venues (for general searches)
export async function getAllVenues(): Promise<{ museums: Museum[], cafes: Cafe[], shows: Show[] }> {
  const [museums, cafes, shows] = await Promise.all([
    getMuseums(),
    getCafes(),
    getShows()
  ])
  return { museums, cafes, shows }
}

// Combined search across all venue types
export async function searchAllVenues(query: string): Promise<{
  museums: Museum[],
  cafes: Cafe[],
  shows: Show[]
}> {
  const [museums, cafes, shows] = await Promise.all([
    searchMuseums(query),
    searchCafes(query),
    searchShows(query)
  ])
  return { museums, cafes, shows }
}

// Get random featured venues (for homepage recommendations)
export async function getRandomFeaturedVenues(count: number = 3): Promise<{
  museums: Museum[],
  cafes: Cafe[],
  shows: Show[]
}> {
  const [featuredMuseums, featuredCafes, featuredShows] = await Promise.all([
    getFeaturedMuseums(),
    getFeaturedCafes(),
    getFeaturedShows()
  ])

  // Shuffle and take random items
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  return {
    museums: shuffleArray(featuredMuseums).slice(0, count),
    cafes: shuffleArray(featuredCafes).slice(0, count),
    shows: shuffleArray(featuredShows).slice(0, count)
  }
}