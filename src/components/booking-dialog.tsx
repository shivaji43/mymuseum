"use client"

import type * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Script from "next/script"

interface BookingItem {
  name: string;
  capacity?: number;
  price?: number;
}

interface BookingDialogProps {
  type: "museum" | "cafe" | "show";
  item: BookingItem;
  trigger: React.ReactNode;
}

export function BookingDialog({ type, item, trigger }: BookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [partySize, setPartySize] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Set default price based on booking type
  const getDefaultPrice = () => {
    switch (type) {
      case "museum":
        return 250; // Default museum entry price
      case "cafe":
        return 500; // Default cafe reservation price
      case "show":
        return 750; // Default show ticket price
      default:
        return 100;
    }
  }
  
  // Calculate total amount
  const getTotalAmount = () => {
    const basePrice = item.price || getDefaultPrice();
    return basePrice * partySize;
  }

  // Handle payment process
  const handlePayment = async () => {
    if (!date || !name || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
          amount: getTotalAmount(),
          currency: 'INR',
          receipt: `${type}-${Date.now()}`,
          notes: {
            name,
            email,
            phone,
            type,
            item: item.name,
            date: date.toISOString(),
            partySize,
          }
        }),
      })

      const order = await orderResponse.json()
      
      if (!order.id) {
        throw new Error(order.error || 'Failed to create order');
      }

      // Load Razorpay checkout
      const options = {
        key: "rzp_test_RhbGZCRx4MVEJU", // Hardcoded for testing - in production use environment variables
        amount: order.amount,
        currency: order.currency,
        name: "Museum Experience",
        description: `Booking for ${item.name}`,
        order_id: order.id,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        notes: {
          type,
          item: item.name,
          date: date.toISOString(),
        },
        theme: {
          color: "#3B82F6",
        },
        callback_url: `${window.location.origin}/payment-success`,
      };

      const razorpay = (window as any).Razorpay(options);
      razorpay.open();
      
      // Reset states after payment is initiated
      setOpen(false)

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

  const getBookingTitle = () => {
    switch (type) {
      case "museum":
        return "Book Museum Visit"
      case "cafe":
        return "Reserve Table"
      case "show":
        return "Book Show Tickets"
      default:
        return "Make Booking"
    }
  }

  const getPartySizeLabel = () => {
    switch (type) {
      case "museum":
        return "Number of Visitors"
      case "cafe":
        return "Party Size"
      case "show":
        return "Number of Tickets"
      default:
        return "Party Size"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">{getBookingTitle()}</DialogTitle>
          <DialogDescription className="text-secondary">Complete your booking for {item.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary">
              Full Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal glass", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partySize" className="text-primary">
              {getPartySizeLabel()}
            </Label>
            <Input
              id="partySize"
              type="number"
              min="1"
              max={item.capacity || 10}
              value={partySize}
              onChange={(e) => setPartySize(Number.parseInt(e.target.value))}
              className="glass"
            />
          </div>

          <div className="pt-4">
            <Button 
              onClick={handlePayment} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Pay ₹{getTotalAmount()}
                </>
              )}
            </Button>
            <div className="text-xs text-center mt-2 text-secondary">
              Secure payments powered by Razorpay
            </div>
          </div>
        </div>
      </DialogContent>
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </Dialog>
  )
}
