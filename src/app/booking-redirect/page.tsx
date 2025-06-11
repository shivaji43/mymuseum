"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getMuseumById, getCafeById, getShowById } from "@/lib/data"

export default function BookingRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [itemName, setItemName] = useState("")
  
  useEffect(() => {
    async function processBookingParams() {
      try {
        const type = searchParams.get('type')
        const id = searchParams.get('id')
        const date = searchParams.get('date')
        const quantity = searchParams.get('quantity') || '1'
        const timeSlot = searchParams.get('timeSlot')
        
        if (!type || !id) {
          toast({
            title: "Missing booking information",
            description: "Unable to process this booking due to missing information.",
            variant: "destructive",
          })
          setTimeout(() => router.push('/'), 2000)
          return
        }
        
        // Convert ID to number
        const itemId = parseInt(id)
        
        // Get item information
        let item, url
        
        switch (type) {
          case 'museum':
            item = await getMuseumById(itemId)
            url = `/museums?bookingId=${itemId}`
            if (date) url += `&date=${date}`
            if (quantity) url += `&quantity=${quantity}`
            break
            
          case 'cafe':
            item = await getCafeById(itemId)
            url = `/cafes?bookingId=${itemId}`
            if (date) url += `&date=${date}`
            if (quantity) url += `&quantity=${quantity}`
            if (timeSlot) url += `&timeSlot=${timeSlot}`
            break
            
          case 'show':
            item = await getShowById(itemId)
            url = `/shows?bookingId=${itemId}`
            if (date) url += `&date=${date}`
            if (quantity) url += `&quantity=${quantity}`
            break
            
          default:
            throw new Error(`Unknown booking type: ${type}`)
        }
        
        if (!item) {
          throw new Error(`Item not found with ID: ${itemId}`)
        }
        
        setItemName(item.name)
        
        // Redirect to the appropriate page with booking parameters
        setTimeout(() => router.push(url), 1500)
      } catch (error) {
        console.error("Error processing booking:", error)
        toast({
          title: "Booking Error",
          description: "There was a problem processing your booking. Please try again.",
          variant: "destructive",
        })
        setTimeout(() => router.push('/'), 2000)
      } finally {
        setIsLoading(false)
      }
    }
    
    processBookingParams()
  }, [router, searchParams, toast])
  
  return (
    <div className="container mx-auto py-20 flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Preparing Your Booking</CardTitle>
          <CardDescription>
            {isLoading ? "Processing your booking request..." : `Taking you to ${itemName} booking...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          ) : (
            <div className="text-center">
              <p className="mb-4">You'll be redirected to complete your booking in a moment.</p>
              <Button onClick={() => router.back()}>Return to Chat</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
