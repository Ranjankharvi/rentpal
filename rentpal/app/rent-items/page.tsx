"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Phone, Package } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface RentalItem {
  id: string
  title: string
  description: string
  imageUrl: string
  phoneNumber: string
  address: string
  userId: string
}

export default function RentItems() {
  const { user } = useAuth()
  const [items, setItems] = useState<RentalItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to fetch items
    const storedItems = localStorage.getItem("rentalItems")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Items Available for Rent</h1>

      {loading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xl text-muted-foreground mb-4">No items have been posted yet</p>
          <p>Be the first to post an item for rent!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id} className="block">
              <Card
                className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow ${
                  user && item.userId === user.id ? "ring-2 ring-pink-500/50" : ""
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.imageUrl || "/placeholder.svg?height=300&width=300"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {user && item.userId === user.id && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-orange-500">
                      Your Item
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone size={16} />
                    <span>{item.phoneNumber}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{item.address}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-sm line-clamp-2">{item.description}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
