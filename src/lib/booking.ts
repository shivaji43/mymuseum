// Booking utilities for the chat interface
import type { Museum, Cafe, Show } from './data';

export type BookingType = 'museum' | 'cafe' | 'show';

// Function to create a booking link that will direct to the appropriate page with params
export function createBookingLink(type: BookingType, itemId: number): string {
  switch (type) {
    case 'museum':
      return `/museums?bookingId=${itemId}`;
    case 'cafe':
      return `/cafes?bookingId=${itemId}`;
    case 'show':
      return `/shows?bookingId=${itemId}`;
    default:
      return '/';
  }
}

// Function to create a Razorpay booking session (returns a deep link to the appropriate page)
export async function createBookingSession(
  type: BookingType, 
  item: Museum | Cafe | Show,
  date?: string, 
  quantity: number = 1,
  timeSlot?: string
): Promise<{ success: boolean; bookingUrl: string; message: string }> {
  try {
    // Create the booking redirect URL with all necessary parameters
    let bookingUrl = `/booking-redirect?type=${type}&id=${item.id}`;
    
    if (date) {
      bookingUrl += `&date=${encodeURIComponent(date)}`;
    }
    
    if (quantity > 1) {
      bookingUrl += `&quantity=${quantity}`;
    }
    
    if (timeSlot) {
      bookingUrl += `&timeSlot=${encodeURIComponent(timeSlot)}`;
    }

    // For the chat interface, we return a direct booking URL
    // The booking-redirect page will handle opening the appropriate booking dialog
    return {
      success: true,
      bookingUrl,
      message: `Great! I've prepared your booking for ${item.name}. Click the booking link to continue.`
    };
  } catch (error) {
    console.error("Error creating booking session:", error);
    return {
      success: false,
      bookingUrl: '/',
      message: "Sorry, there was an error preparing your booking. Please try again later."
    };
  }
}
