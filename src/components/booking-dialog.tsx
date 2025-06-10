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
import { CalendarIcon, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface BookingItem {
  name: string;
  capacity?: number;
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
  const { toast } = useToast()

  const handleBooking = () => {
    if (!date || !name || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate booking process
    toast({
      title: "Booking Confirmed!",
      description: `Your ${type} booking for ${item.name} has been confirmed for ${format(date, "PPP")}.`,
    })

    setOpen(false)
    // Reset form
    setDate(undefined)
    setPartySize(1)
    setName("")
    setEmail("")
    setPhone("")
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
            <Button onClick={handleBooking} className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
