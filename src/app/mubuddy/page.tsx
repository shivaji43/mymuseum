"use client"

import type React from "react"

import { useRef, useEffect, useCallback , useState } from "react"
import { useChat, type Message } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  User,
  Sparkles,
  MessageCircle,
  Coffee,
  Building,
  Theater,
  MapPin,
  Star,
  Clock,
  Info,
  StopCircle,
  ExternalLink,
  DollarSign,
  Award
} from "lucide-react"

const quickActions = [
  {
    icon: Building,
    label: "Historical Museums",
    description: "Explore India's ancient heritage",
    query: "Show me historical museums with artifacts from ancient India",
  },
  {
    icon: Theater,
    label: "Classical Performances",
    description: "Traditional dance & music shows",
    query: "Find classical Indian performances like Kathak or Bharatanatyam",
  },
  {
    icon: Coffee,
    label: "Heritage Cafés",
    description: "Historic Irani cafés & eateries",
    query: "Recommend heritage cafés with cultural significance",
  },
  {
    icon: MapPin,
    label: "Heritage Trail",
    description: "Plan a historical tour",
    query: "Help me plan a heritage trail covering museums and cultural sites",
  },
]

const initialSuggestions = [
  "Museums showcasing Mughal era artifacts",
  "Ancient Indian archaeological sites",
  "Heritage Irani cafés in Mumbai",
  "Classical dance performances this week",
]

// Helper component to render a star rating based on a number
const StarRating = ({ rating, totalStars = 5 }: { rating: number; totalStars?: number }) => {
  const roundedRating = Math.round(rating * 2) / 2 // Round to nearest 0.5

  return (
    <div className="inline-flex items-center gap-2" aria-label={`Rating: ${rating} out of ${totalStars} stars`}>
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < roundedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground font-medium">({rating.toFixed(1)}/5)</span>
    </div>
  )
}

// Helper component for displaying cafe information in a card format
function CafeCard({ 
  name, 
  location, 
  rating, 
  priceRange, 
  averagePrice, 
  description,
  highlights,
  hours,
  website,
  bookingUrl
}: { 
  name: string;
  location?: string;
  rating?: string;
  priceRange?: string;
  averagePrice?: string;
  description?: string;
  highlights?: string;
  hours?: string;
  website?: string;
  bookingUrl?: string;
}) {
  return (
    <Card className="w-full mb-4 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-1">
              <Coffee className="h-5 w-5 text-primary" />
              {name}
            </CardTitle>
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            )}
          </div>
          {rating && (
            <div className="shrink-0">
              <StarRating rating={parseFloat(rating)} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2">
          {description && <p className="text-sm">{description}</p>}
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {priceRange && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span>
                  {priceRange} 
                  <span className="text-xs text-muted-foreground">
                    {priceRange.length === 1 ? '(Budget)' : priceRange.length === 2 ? '(Moderate)' : '(Premium)'}
                  </span>
                </span>
              </div>
            )}
            
            {averagePrice && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-primary">{averagePrice}</span>
                <span className="text-xs text-muted-foreground">avg/person</span>
              </div>
            )}
            
            {hours && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{hours}</span>
              </div>
            )}
          </div>
          
          {highlights && (
            <div className="text-sm">
              <div className="flex items-start gap-1">
                <Award className="h-3.5 w-3.5 text-primary mt-1" />
                <div>
                  <span className="font-medium">Highlights:</span>{' '}
                  <span>
                    {highlights.split(', ').map((item, i, arr) => (
                      <span key={i} className="inline-block">
                        <span className="text-primary">{item}</span>
                        {i < arr.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-2">
            {website && (
              <a
                href={website.startsWith('www.') ? `http://${website}` : website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Visit Website
              </a>
            )}
            
            {bookingUrl && (
              <div className="inline-block">
                <BookingButton 
                  url={bookingUrl} 
                  label="Reserve Table"
                  type="Cafe Table" 
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for booking button
function BookingButton({ url, label, type }: { url: string; label: string; type: string }) {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleClick = () => {
    setLoading(true);
    try {
      // Show a toast notification
      toast({
        title: "Redirecting to booking page",
        description: `Preparing your ${type.toLowerCase()} booking...`
      });
      
      // Set a timeout to allow the toast to show before redirecting
      setTimeout(() => {
        setClicked(true);
        window.location.href = url;
      }, 1000);
    } catch (error) {
      console.error("Navigation error:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not open booking page. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (clicked) {
    return null; // Button disappears after click
  }

  return (
    <Button 
      onClick={handleClick}
      className="mt-2 mb-2"
      variant="default"
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
          Preparing Booking...
        </>
      ) : (
        label || `Book ${type}`
      )}
    </Button>
  );
}

// The main component for parsing and rendering the AI's Markdown-like responses
function FormattedMessage({ content }: { content: string }) {
  // This helper function parses multiple inline patterns: links, ratings, bold, italic, price, and booking links
  const renderInlineFormatting = (text: string) => {
    const elements: React.ReactNode[] = []
    let lastIndex = 0

    // Enhanced regex to detect various formatting patterns including booking URLs
    const regex =
      /\[([^\]]+)\]\$\$(https?:\/\/[^\$\$]+)\)|\[([^\]]+)\]\((?:#)?(\/?(?:museums|cafes|shows)\?bookingId=\d+[^\)]+)\)|\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\)]+)\)|(Rating:\s*(\d(?:\.\d)?)(?:\s*\/\s*5|\/5))|(?:Price Range:\s*)?(₹{1,3})|(Location:\s*([^,\n]+(?:,\s*[^,\n]+)?))|(Highlights:\s*([^\n]+))|(Open Hours:\s*([^\n]+))|\*\*([^*]+)\*\*|\*([^*]+)\*|(₹\d+(?:,\d+)*)/gi

    let match
    while ((match = regex.exec(text)) !== null) {
      // Push the plain text part before the match
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>)
      }

      const [
        , // full match
        linkText,
        linkUrl,
        bookingText,
        bookingUrl,
        externalLinkText,
        externalLinkUrl,
        ratingFull,
        ratingValue,
        priceRange,
        locationFull,
        locationValue,
        highlightsFull,
        highlightsValue,
        openHoursFull,
        openHoursValue,
        boldContent,
        italicContent,
        price,
      ] = match

      // Handle regular links
      if (linkText && linkUrl) {
        elements.push(
          <a
            key={`link-${lastIndex}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            {linkText}
          </a>,
        )
      } 
      // Handle booking links - convert to buttons
      else if (bookingText && bookingUrl) {
        // Determine what type of booking this is
        let type = "Item";
        if (bookingUrl.includes("/museums")) type = "Museum Visit";
        else if (bookingUrl.includes("/cafes")) type = "Cafe Table";
        else if (bookingUrl.includes("/shows")) type = "Show Tickets";
        
        elements.push(
          <div key={`booking-${lastIndex}`} className="flex flex-col">
            <BookingButton 
              url={bookingUrl} 
              label={`Book ${type}: ${bookingText}`}
              type={type} 
            />
            <span className="text-xs text-muted-foreground">Click once to proceed to payment</span>
          </div>
        )
      }
      // Handle external website links
      else if (externalLinkText && externalLinkUrl) {
        const url = externalLinkUrl.startsWith('www.') ? `http://${externalLinkUrl}` : externalLinkUrl;
        elements.push(
          <a
            key={`external-${lastIndex}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80 flex items-center gap-1"
          >
            {externalLinkText}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>,
        )
      }
      // Handle location information
      else if (locationFull && locationValue) {
        elements.push(
          <div key={`location-${lastIndex}`} className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{locationValue}</span>
          </div>,
        )
      }
      // Handle price range (₹, ₹₹, ₹₹₹)
      else if (priceRange) {
        elements.push(
          <div key={`price-range-${lastIndex}`} className="inline-flex items-center gap-1">
            <span className="font-medium text-primary">{priceRange}</span>
            <span className="text-xs text-muted-foreground">{priceRange.length === 1 ? '(Budget)' : priceRange.length === 2 ? '(Moderate)' : '(Premium)'}</span>
          </div>,
        )
      }
      // Handle highlights
      else if (highlightsFull && highlightsValue) {
        elements.push(
          <div key={`highlights-${lastIndex}`} className="mt-1 text-sm">
            <span className="font-medium">Highlights:</span>{' '}
            <span>{highlightsValue.split(', ').map((item, i, arr) => (
              <span key={i}>
                <span className="text-primary">{item}</span>
                {i < arr.length - 1 ? ', ' : ''}
              </span>
            ))}</span>
          </div>,
        )
      }
      // Handle open hours
      else if (openHoursFull && openHoursValue) {
        elements.push(
          <div key={`hours-${lastIndex}`} className="text-sm flex items-center gap-1 mt-1">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{openHoursValue}</span>
          </div>,
        )
      }
      // Handle ratings
      else if (ratingFull && ratingValue) {
        elements.push(<StarRating key={`rating-${lastIndex}`} rating={Number.parseFloat(ratingValue)} />)
      } 
      // Handle bold text
      else if (boldContent) {
        elements.push(
          <strong key={`bold-${lastIndex}`} className="font-semibold">
            {boldContent}
          </strong>,
        )
      } 
      // Handle italic text
      else if (italicContent) {
        elements.push(
          <em key={`italic-${lastIndex}`} className="italic">
            {italicContent}
          </em>,
        )
      } 
      // Handle price formatting
      else if (price) {
        elements.push(
          <span key={`price-${lastIndex}`} className="font-semibold text-primary">
            {price}
          </span>,
        )
      }

      lastIndex = regex.lastIndex
    }

    // Push any remaining text after the last match
    if (lastIndex < text.length) {
      elements.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>)
    }

    return elements
  }

  // This outer logic handles block-level elements: headings, lists, and paragraphs.
  const elements: React.ReactNode[] = []
  const lines = content.split("\n")
  let listType: "ul" | "ol" | null = null
  let listItems: React.ReactNode[] = []

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListComponent = listType
      elements.push(
        <ListComponent
          key={`list-${elements.length}`}
          className={`pl-5 space-y-1 my-2 ${ListComponent === "ul" ? "list-disc" : "list-decimal"}`}
        >
          {listItems}
        </ListComponent>,
      )
    }
    listItems = []
    listType = null
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith("### ")) {
      flushList()
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-semibold mt-4 mb-2">
          {renderInlineFormatting(trimmedLine.substring(4))}
        </h3>,
      )
    } else if (trimmedLine.startsWith("## ")) {
      flushList()
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl font-bold mt-5 mb-3">
          {renderInlineFormatting(trimmedLine.substring(3))}
        </h2>,
      )
    } else if (trimmedLine.startsWith("# ")) {
      flushList()
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl font-bold mt-6 mb-4">
          {renderInlineFormatting(trimmedLine.substring(2))}
        </h1>,
      )
    } else {
      const isUl = trimmedLine.startsWith("• ") || trimmedLine.startsWith("- ")
      const isOl = /^\d+\.\s/.test(trimmedLine)

      if (isUl) {
        if (listType !== "ul") {
          flushList()
          listType = "ul"
        }
        listItems.push(<li key={`li-${index}`}>{renderInlineFormatting(trimmedLine.substring(2))}</li>)
      } else if (isOl) {
        if (listType !== "ol") {
          flushList()
          listType = "ol"
        }
        listItems.push(<li key={`li-${index}`}>{renderInlineFormatting(trimmedLine.replace(/^\d+\.\s/, ""))}</li>)
      } else {
        flushList()
        if (trimmedLine !== "") {
          elements.push(
            <p key={`p-${index}`} className="mb-2 last:mb-0">
              {renderInlineFormatting(trimmedLine)}
            </p>,
          )
        }
      }
    }
  })

  flushList() // Finalize any list at the end of the content

  return <div className="space-y-1">{elements}</div>
}

// The main page component
export default function MuBuddyPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Function to load messages from localStorage
  const loadMessages = (): Message[] => {
    try {
      const storedMessages = localStorage.getItem("chatMessages")
      return storedMessages ? JSON.parse(storedMessages) : []
    } catch (error) {
      console.error("Failed to load messages from localStorage:", error)
      return []
    }
  }

  // Function to save messages to localStorage
  const saveMessages = (messagesToSave: Message[]) => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messagesToSave))
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error)
    }
  }

  // Determine initial messages: from localStorage if available, otherwise default
  const initialChatMessages = loadMessages()
  const defaultInitialMessage: Message[] = [
    {
      id: "1",
      role: "assistant",
      content:
        "Namaste! I'm muBuddy, your expert guide to India's incredible 5000-year heritage. I'm passionate about helping you discover fascinating historical museums, heritage cafés, and cultural performances across India. Whether you're interested in ancient civilizations, Mughal architecture, colonial history, or traditional arts, I'm here to help you explore and book unforgettable cultural experiences. What aspect of Indian heritage would you like to discover today?",
    },
  ]

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    initialMessages: initialChatMessages.length > 0 ? initialChatMessages : defaultInitialMessage,
  })

  // Effect to save messages whenever they change
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [])

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [messages, scrollToBottom])

  // Effect to scroll to bottom on initial load
  useEffect(() => {
    // Multiple attempts to ensure scrolling works on initial load
    const timeouts = [100, 300, 500].map((delay) => setTimeout(scrollToBottom, delay))

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [scrollToBottom])

  const handleQuickAction = (query: string) => {
    handleInputChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>)
    handleSubmit(new Event("submit") as any)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>)
    handleSubmit(new Event("submit") as any)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">muBuddy</h1>
              <p className="text-sm text-muted-foreground">Your AI Heritage & Cultural Guide</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto relative">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="mb-8">
                <h2 className="mb-4 text-center text-lg font-semibold">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                        onClick={() => handleQuickAction(action.query)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">{action.label}</h3>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Chat Interface */}
            <Card className="mx-auto max-w-3xl flex flex-col h-full">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with muBuddy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                            }`}
                          >
                            {message.role === "user" ? (
                              <p className="text-sm">{message.content}</p>
                            ) : (
                              <div className="text-sm">
                                <FormattedMessage content={message.content} />
                              </div>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          {message.role === "assistant" && message.id === "1" && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs text-muted-foreground">Suggested questions:</p>
                              <div className="flex flex-wrap gap-2">
                                {initialSuggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="h-auto py-1 px-2 text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Input (fixed at bottom) */}
      <div className="sticky bottom-0 bg-background border-t p-4 z-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about historical museums, heritage sites, classical performances..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
              {isLoading && (
                <Button type="button" variant="outline" size="icon" onClick={stop} title="Stop generating">
                  <StopCircle className="h-4 w-4" />
                </Button>
              )}
            </form>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              muBuddy - Your expert guide to India's 5000-year heritage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
