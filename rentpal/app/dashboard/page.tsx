"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Phone, Pencil, Trash2, Plus, Package } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RentalItem {
  id: string
  title: string
  description: string
  imageUrl: string
  phoneNumber: string
  address: string
  userId: string
}

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [userItems, setUserItems] = useState<RentalItem[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      // Load user's items
      const allItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      const filteredItems = allItems.filter((item: RentalItem) => item.userId === user.id)
      setUserItems(filteredItems)
    }
  }, [user])

  const handleDeleteItem = (itemId: string) => {
    setIsDeleting(true)
    try {
      // Get all items
      const allItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      // Filter out the item to delete
      const updatedItems = allItems.filter((item: RentalItem) => item.id !== itemId)
      // Save back to localStorage
      localStorage.setItem("rentalItems", JSON.stringify(updatedItems))
      // Update state
      setUserItems(userItems.filter((item) => item.id !== itemId))

      toast({
        title: "Item deleted",
        description: "Your item has been removed from listings",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-73px)]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Manage your rental items here.</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
        >
          <Link href="/post-item" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Item
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Posted Items</h2>

        {userItems.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No items posted yet</h3>
            <p className="text-muted-foreground mb-4">Start sharing your items with the community</p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <Link href="/post-item">Post Your First Item</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/item/${item.id}`} className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=300&width=300"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
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
                </Link>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                    <Link href={`/edit-item/${item.id}`}>
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your item "{item.title}" from the listings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
