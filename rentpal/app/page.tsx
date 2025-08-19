import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Package, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
          RentPal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop platform for renting and posting items in your community
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="flex flex-col h-full border-none shadow-lg bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="h-6 w-6 text-pink-500" />
              Rent Items
            </CardTitle>
            <CardDescription>Browse items available for rent in your area</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/20 dark:to-orange-900/20 rounded-md flex items-center justify-center mb-4 overflow-hidden relative">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-4">
                <div className="bg-white/80 dark:bg-black/50 rounded-md shadow-sm"></div>
                <div className="bg-white/80 dark:bg-black/50 rounded-md shadow-sm"></div>
                <div className="bg-white/80 dark:bg-black/50 rounded-md shadow-sm"></div>
                <div className="bg-white/80 dark:bg-black/50 rounded-md shadow-sm"></div>
              </div>
              <Package className="h-16 w-16 text-pink-500/50 z-10" />
            </div>
            <p>View all available items for rent with photos, contact information, and location details.</p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <Link href="/rent-items" className="flex items-center justify-center gap-2">
                Browse Rental Items
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full border-none shadow-lg bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="h-6 w-6 text-orange-500" />
              Post Items
            </CardTitle>
            <CardDescription>List your items for others to rent</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-md flex items-center justify-center mb-4 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-white/80 dark:bg-black/50 rounded-md shadow-sm flex items-center justify-center">
                  <Upload className="h-12 w-12 text-orange-500/50" />
                </div>
              </div>
            </div>
            <p>Upload photos of your items, add your contact details, and make them available for others to rent.</p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Link href="/post-item" className="flex items-center justify-center gap-2">
                Post an Item
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
