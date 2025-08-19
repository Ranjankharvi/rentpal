"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, ArrowLeft, Calendar, Pencil, Trash2, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
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
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface RentalItem {
  id: string
  title: string
  description: string
  imageUrl: string
  phoneNumber: string
  address: string
  userId: string
  createdAt: string
}

export default function ItemDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [item, setItem] = useState<RentalItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [ownerName, setOwnerName] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the item details
    const fetchItem = () => {
      const allItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      const foundItem = allItems.find((i: RentalItem) => i.id === params.id)

      if (foundItem) {
        setItem(foundItem)

        // Get the owner's name if available
        if (foundItem.userId) {
          const users = JSON.parse(localStorage.getItem("rentpal_users") || "[]")
          const owner = users.find((u: { id: string }) => u.id === foundItem.userId)
          if (owner) {
            setOwnerName(owner.name)
          }
        }
      }

      setLoading(false)
    }

    fetchItem()
  }, [params.id])

  const handleDeleteItem = () => {
    if (!item) return

    setIsDeleting(true)
    try {
      // Get all items
      const allItems = JSON.parse(localStorage.getItem("rentalItems") || "[]")
      // Filter out the item to delete
      const updatedItems = allItems.filter((i: RentalItem) => i.id !== item.id)
      // Save back to localStorage
      localStorage.setItem("rentalItems", JSON.stringify(updatedItems))

      toast({
        title: "Item deleted",
        description: "Your item has been removed from listings",
      })

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-73px)]">
        <p>Loading item details...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/rent-items" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </Button>

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/rent-items">Browse Available Items</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = user && item.userId === user.id
  const postedDate = item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : "Recently"

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/rent-items" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={item.imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            {isOwner && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-500">Your Item</Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted {postedDate}</span>
            </div>
            {ownerName && (
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Posted by {ownerName}</span>
              </div>
            )}
          </div>

          <Card className="p-6 border-none shadow-md bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{item.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="font-medium">{item.address}</p>
                </div>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div className="prose prose-sm max-w-none">
              {item.description ? (
                <p>{item.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-4 pt-4">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                <Link href={`/edit-item/${item.id}`} className="flex items-center justify-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Item
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Item
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
                      onClick={handleDeleteItem}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
