import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"
import {
  getMuseums,
  getCafes,
  getShows,
  searchMuseums,
  searchCafes,
  searchShows,
  getMuseumsByCategory,
  getCafesByCategory,
  getShowsByCategory,
  getFeaturedMuseums,
  getFeaturedCafes,
  getFeaturedShows,
  getMuseumCities,
  getCafeCities,
  getShowCities,
  getMuseumById,
  getCafeById,
  getShowById,
} from "@/lib/data"
import { createBookingSession } from "@/lib/booking"

export const maxDuration = 30

const systemPrompt = `You are MuBuddy, an expert AI guide specializing in India's rich cultural heritage and a booking assistant for BookEase platform. You are passionate about Indian history and help users discover and book:

1. **MUSEUMS** - Historical museums showcasing India's 5000-year heritage, archaeological treasures, art galleries, and cultural centers
2. **HERITAGE CAFES** - Traditional Irani cafés, historic restaurants, and culturally significant dining experiences  
3. **CULTURAL SHOWS** - Classical performances, traditional theater, folk arts, and heritage entertainment

CRITICAL: You MUST use the available tools to search and retrieve data. NEVER make up information.

Tool Usage Guidelines:
- When users ask about cafes, museums, or shows → Use searchMuseums, searchCafes, or searchShows tools
- When users mention a specific city → Use getMuseumsByCity, getCafesByCity, or getShowsByCity tools
- When users ask for recommendations → Use getFeaturedMuseums, getFeaturedCafes, or getFeaturedShows tools
- When users mention budget/price → Use getMuseumsByPriceRange, getCafesByPriceRange, or getShowsByPriceRange tools
- When users ask about categories → Use getMuseumsByCategory, getCafesByCategory, or getShowsByCategory tools
- Users ask examples in small text for example farzi cafe , cafe mysore , but in db they are labelled as Café treat them similarly seach cafe as Café

IMPORTANT: Always call the appropriate tool BEFORE providing any venue information. If a tool returns no results, acknowledge this and suggest alternatives.

When users express interest in booking or making reservations:
- For museums → Use createMuseumBooking tool
- For cafes → Use createCafeBooking tool
- For shows → Use createShowBooking tool

After using a booking tool, provide the booking link and explain that clicking it will take them to complete their booking with payment.

As an expert on Indian historical museums, you:
- Share fascinating stories about museums and their collections
- Explain the historical significance of artifacts and exhibitions
- Connect museums to different eras of Indian history (Indus Valley, Mauryan, Gupta, Mughal, Colonial, etc.)
- Recommend museums based on specific historical interests
- Provide context about India's diverse cultural heritage

When presenting results:
- List the actual venues returned by the tools
- Include key details: name, location, price, rating, highlights
- Add historical context and cultural significance
- Provide booking information (contact numbers, websites)
- Suggest related experiences

Format your responses with:
- Use bold (**text**) for venue names and important details
- Use bullet points for venue features
- Include prices in rupees (₹)
- Mention ratings and special features
- Add interesting historical facts when relevant

Your tone should be knowledgeable yet approachable, like a passionate history professor who makes the past come alive!`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxSteps: 5, // Allow multiple tool calls
      tools: {
        searchMuseums: tool({
          description: "Search for museums by name, location, or description. Use this when users ask about museums.",
          parameters: z.object({
            query: z.string().describe("Search query for museums"),
          }),
          execute: async ({ query }) => {
            console.log("Searching museums with query:", query)
            const museums = await searchMuseums(query)
            console.log("Found museums:", museums.length)
            return { museums, count: museums.length }
          },
        }),
        searchCafes: tool({
          description: "Search for cafes by name, location, cuisine, or description. Use this when users ask about cafes or restaurants.",
          parameters: z.object({
            query: z.string().describe("Search query for cafes"),
          }),
          execute: async ({ query }) => {
            console.log("Searching cafes with query:", query)
            const cafes = await searchCafes(query)
            console.log("Found cafes:", cafes.length)
            return { cafes, count: cafes.length }
          },
        }),
        searchShows: tool({
          description: "Search for shows by name, venue, location, genre, or description. Use this when users ask about performances or shows.",
          parameters: z.object({
            query: z.string().describe("Search query for shows"),
          }),
          execute: async ({ query }) => {
            console.log("Searching shows with query:", query)
            const shows = await searchShows(query)
            console.log("Found shows:", shows.length)
            return { shows, count: shows.length }
          },
        }),
        getMuseumsByCategory: tool({
          description: "Get museums filtered by category (Art, History, Science, or all)",
          parameters: z.object({
            category: z.string().describe("Category of museums (Art, History, Science, all)"),
          }),
          execute: async ({ category }) => {
            console.log("Getting museums by category:", category)
            const museums = await getMuseumsByCategory(category)
            return { museums, count: museums.length }
          },
        }),
        getCafesByCategory: tool({
          description: "Get cafes filtered by category (Traditional, Modern, Fast Food, or all)",
          parameters: z.object({
            category: z.string().describe("Category of cafes (Traditional, Modern, Fast Food, all)"),
          }),
          execute: async ({ category }) => {
            console.log("Getting cafes by category:", category)
            const cafes = await getCafesByCategory(category)
            return { cafes, count: cafes.length }
          },
        }),
        getShowsByCategory: tool({
          description: "Get shows filtered by category (Theater, Concert, Comedy, or all)",
          parameters: z.object({
            category: z.string().describe("Category of shows (Theater, Concert, Comedy, all)"),
          }),
          execute: async ({ category }) => {
            console.log("Getting shows by category:", category)
            const shows = await getShowsByCategory(category)
            return { shows, count: shows.length }
          },
        }),
        getFeaturedMuseums: tool({
          description: "Get featured/popular museums. Use when asking for recommendations or popular options.",
          parameters: z.object({}),
          execute: async () => {
            console.log("Getting featured museums")
            const museums = await getFeaturedMuseums()
            return { museums, count: museums.length }
          },
        }),
        getFeaturedCafes: tool({
          description: "Get featured/popular cafes. Use when asking for recommendations or popular options.",
          parameters: z.object({}),
          execute: async () => {
            console.log("Getting featured cafes")
            const cafes = await getFeaturedCafes()
            return { cafes, count: cafes.length }
          },
        }),
        getFeaturedShows: tool({
          description: "Get featured/popular shows. Use when asking for recommendations or popular options.",
          parameters: z.object({}),
          execute: async () => {
            console.log("Getting featured shows")
            const shows = await getFeaturedShows()
            return { shows, count: shows.length }
          },
        }),
        getMuseumCities: tool({
          description: "Get list of cities that have museums in our database",
          parameters: z.object({}),
          execute: async () => {
            const cities = await getMuseumCities()
            return { cities, count: cities.length }
          },
        }),
        getCafeCities: tool({
          description: "Get list of cities that have cafes in our database",
          parameters: z.object({}),
          execute: async () => {
            const cities = await getCafeCities()
            return { cities, count: cities.length }
          },
        }),
        getShowCities: tool({
          description: "Get list of cities that have shows in our database",
          parameters: z.object({}),
          execute: async () => {
            const cities = await getShowCities()
            return { cities, count: cities.length }
          },
        }),
        getMuseumsByCity: tool({
          description: "Get all museums in a specific city",
          parameters: z.object({
            city: z.string().describe("City name (e.g., Delhi, Mumbai, Kolkata)"),
          }),
          execute: async ({ city }) => {
            console.log("Getting museums in city:", city)
            const museums = await getMuseums()
            const filtered = museums.filter(m => m.city.toLowerCase() === city.toLowerCase())
            return { museums: filtered, count: filtered.length }
          },
        }),
        getCafesByCity: tool({
          description: "Get all cafes in a specific city",
          parameters: z.object({
            city: z.string().describe("City name (e.g., Delhi, Mumbai, Kolkata)"),
          }),
          execute: async ({ city }) => {
            console.log("Getting cafes in city:", city)
            const cafes = await getCafes()
            const filtered = cafes.filter(c => c.city.toLowerCase() === city.toLowerCase())
            return { cafes: filtered, count: filtered.length }
          },
        }),
        getShowsByCity: tool({
          description: "Get all shows in a specific city",
          parameters: z.object({
            city: z.string().describe("City name (e.g., Delhi, Mumbai, Kolkata)"),
          }),
          execute: async ({ city }) => {
            console.log("Getting shows in city:", city)
            const shows = await getShows()
            const filtered = shows.filter(s => s.city.toLowerCase() === city.toLowerCase())
            return { shows: filtered, count: filtered.length }
          },
        }),
        getMuseumsByPriceRange: tool({
          description: "Get museums within a specific price range",
          parameters: z.object({
            minPrice: z.number().describe("Minimum price in rupees"),
            maxPrice: z.number().describe("Maximum price in rupees"),
          }),
          execute: async ({ minPrice, maxPrice }) => {
            console.log(`Getting museums between ₹${minPrice} and ₹${maxPrice}`)
            const museums = await getMuseums()
            const filtered = museums.filter(m => m.price >= minPrice && m.price <= maxPrice)
            return { museums: filtered, count: filtered.length }
          },
        }),
        getCafesByPriceRange: tool({
          description: "Get cafes within a specific average price range",
          parameters: z.object({
            minPrice: z.number().describe("Minimum average price in rupees"),
            maxPrice: z.number().describe("Maximum average price in rupees"),
          }),
          execute: async ({ minPrice, maxPrice }) => {
            console.log(`Getting cafes between ₹${minPrice} and ₹${maxPrice}`)
            const cafes = await getCafes()
            const filtered = cafes.filter(c => c.avgPrice >= minPrice && c.avgPrice <= maxPrice)
            return { cafes: filtered, count: filtered.length }
          },
        }),
        getShowsByPriceRange: tool({
          description: "Get shows within a specific ticket price range",
          parameters: z.object({
            minPrice: z.number().describe("Minimum ticket price in rupees"),
            maxPrice: z.number().describe("Maximum ticket price in rupees"),
          }),
          execute: async ({ minPrice, maxPrice }) => {
            console.log(`Getting shows between ₹${minPrice} and ₹${maxPrice}`)
            const shows = await getShows()
            const filtered = shows.filter(s => s.ticketPrice >= minPrice && s.ticketPrice <= maxPrice)
            return { shows: filtered, count: filtered.length }
          },
        }),
        createMuseumBooking: tool({
          description: "Create a booking link for a museum visit when the user wants to book a specific museum",
          parameters: z.object({
            museumId: z.number().describe("ID of the museum to book"),
            date: z.string().optional().describe("Selected date for the visit in YYYY-MM-DD format"),
            quantity: z.number().optional().describe("Number of tickets to book"),
          }),
          execute: async ({ museumId, date, quantity = 1 }) => {
            console.log(`Creating museum booking for ID: ${museumId}, Date: ${date}, Quantity: ${quantity}`)
            const museum = await getMuseumById(museumId)
            
            if (!museum) {
              return { 
                success: false, 
                message: "Sorry, could not find the museum you're trying to book.",
                bookingUrl: null
              }
            }
            
            // Create direct URL to museums page with booking parameters
            let bookingUrl = `/museums?bookingId=${museumId}`
            
            if (date) {
              bookingUrl += `&date=${encodeURIComponent(date)}`
            }
            
            if (quantity && quantity > 1) {
              bookingUrl += `&quantity=${quantity}`
            }
            
            return {
              success: true,
              message: `I've prepared your booking for **${museum.name}**. [${museum.name}](${bookingUrl}) Use the booking button below to proceed to the payment page.`,
              bookingUrl: bookingUrl,
              museum: museum,
              instructions: "When you click the booking button, the booking form will open automatically where you can complete your payment securely."
            }
          },
        }),
        createCafeBooking: tool({
          description: "Create a booking link for a cafe reservation when the user wants to reserve a table",
          parameters: z.object({
            cafeId: z.number().describe("ID of the cafe to book"),
            date: z.string().optional().describe("Selected date for the reservation in YYYY-MM-DD format"),
            quantity: z.number().optional().describe("Number of people in the party"),
            timeSlot: z.string().optional().describe("Selected time slot for the reservation"),
          }),
          execute: async ({ cafeId, date, quantity = 2, timeSlot }) => {
            console.log(`Creating cafe booking for ID: ${cafeId}, Date: ${date}, People: ${quantity}, Time: ${timeSlot}`)
            const cafe = await getCafeById(cafeId)
            
            if (!cafe) {
              return { 
                success: false, 
                message: "Sorry, could not find the cafe you're trying to book.",
                bookingUrl: null
              }
            }
            
            // Create direct URL to cafes page with booking parameters
            let bookingUrl = `/cafes?bookingId=${cafeId}`
            
            if (date) {
              bookingUrl += `&date=${encodeURIComponent(date)}`
            }
            
            if (quantity && quantity > 1) {
              bookingUrl += `&quantity=${quantity}`
            }
            
            if (timeSlot) {
              bookingUrl += `&timeSlot=${encodeURIComponent(timeSlot)}`
            }
            
            return {
              success: true,
              message: `I've prepared your table reservation for **${cafe.name}**. [${cafe.name}](${bookingUrl}) Use the booking button below to reserve your table and proceed to payment.`,
              bookingUrl: bookingUrl,
              cafe: cafe,
              instructions: "When you click the booking button, the reservation form will open automatically where you can complete your payment securely."
            }
          },
        }),
        createShowBooking: tool({
          description: "Create a booking link for show tickets when the user wants to book a show",
          parameters: z.object({
            showId: z.number().describe("ID of the show to book"),
            date: z.string().optional().describe("Selected date for the show in YYYY-MM-DD format"),
            quantity: z.number().optional().describe("Number of tickets to book"),
            showtime: z.string().optional().describe("Selected showtime for the show"),
          }),
          execute: async ({ showId, date, quantity = 1, showtime }) => {
            console.log(`Creating show booking for ID: ${showId}, Date: ${date}, Tickets: ${quantity}, Showtime: ${showtime}`)
            const show = await getShowById(showId)
            
            if (!show) {
              return { 
                success: false, 
                message: "Sorry, could not find the show you're trying to book.",
                bookingUrl: null
              }
            }
            
            // Create direct URL to shows page with booking parameters
            let bookingUrl = `/shows?bookingId=${showId}`
            
            if (date) {
              bookingUrl += `&date=${encodeURIComponent(date)}`
            }
            
            if (quantity && quantity > 1) {
              bookingUrl += `&quantity=${quantity}`
            }
            
            if (showtime) {
              bookingUrl += `&showtime=${encodeURIComponent(showtime)}`
            }
            
            return {
              success: true,
              message: `I've prepared your ticket booking for **${show.name}**. [${show.name}](${bookingUrl}) Use the booking button below to purchase your tickets.`,
              bookingUrl: bookingUrl,
              show: show,
              instructions: "When you click the booking button, the ticket booking form will open automatically where you can complete your payment securely."
            }
          },
        })
      }
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process request" }), 
      { status: 500 }
    )
  }
}