"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function PostItem() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to post items",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    setImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to post items",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!title || !phoneNumber || !address || !imagePreview) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, we would upload the image to a storage service
      // and save the item data to a database

      const newItem = {
        id: uuidv4(),
        title,
        description,
        imageUrl: imagePreview, // In a real app, this would be the URL from the storage service
        phoneNumber,
        address,
        userId: user.id, // Associate the item with the current user
        createdAt: new Date().toISOString(),
      }

      // For demo purposes, we'll store in localStorage
      const existingItems = localStorage.getItem("rentalItems")
      const items = existingItems ? JSON.parse(existingItems) : []
      items.push(newItem)
      localStorage.setItem("rentalItems", JSON.stringify(items))

      toast({
        title: "Item posted successfully",
        description: "Your item has been posted for rent",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPhoneNumber("")
      setAddress("")
      setImagePreview(null)
      setImageFile(null)

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error posting item",
        description: "There was an error posting your item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-73px)]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Post an Item for Rent</h1>

      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20">
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Fill in the details about the item you want to rent out</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                placeholder="What are you renting out?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your item, condition, rental terms, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your contact number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Where can the item be picked up?"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Item Photo</Label>
              {imagePreview ? (
                <div className="relative aspect-video w-full max-w-md mx-auto">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Item preview"
                    fill
                    className="object-contain rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white h-10 px-4 py-2"
                    >
                      Upload Image
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Item for Rent"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
