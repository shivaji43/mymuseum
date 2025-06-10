import { NextResponse } from "next/server"
import { getCafes, searchCafes, getCafesByCity } from "@/lib/data"

// Debug endpoint to test if data loading works
export async function GET() {
  try {
    // Test basic data loading
    const allCafes = await getCafes()
    console.log("Total cafes loaded:", allCafes.length)
    
    // Test search functionality
    const delhiSearch = await searchCafes("Delhi")
    console.log("Delhi search results:", delhiSearch.length)
    
    // Test city filter
    const mumbaicafes = await getCafesByCity("Mumbai")
    console.log("Mumbai cafes:", mumbaicafes.length)
    
    // Return debug info
    return NextResponse.json({
      success: true,
      totalCafes: allCafes.length,
      sampleCafe: allCafes[0] ? {
        name: allCafes[0].name,
        city: allCafes[0].city,
        category: allCafes[0].category
      } : null,
      searchTest: {
        query: "Delhi",
        results: delhiSearch.length,
        sampleResult: delhiSearch[0]?.name || null
      },
      cityTest: {
        city: "Mumbai",
        results: mumbaicafes.length,
        cafes: mumbaicafes.map(c => c.name)
      }
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}