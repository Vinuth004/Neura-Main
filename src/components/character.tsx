
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export  function Character () {
  return (
    <Card className="mx-auto max-w-sm mt-10">
      <CardHeader>
        <CardTitle className="text-xl">Character Customization</CardTitle>
        <CardDescription>
          Enter your information about current body parameters, desired goals etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (Kg)</Label>
              <Input id="weight" placeholder="70" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" placeholder="180" type="number" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="18"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">Allergies (seperate by a comma)</Label>
            <Input id="allergies" type="text" placeholder="Peanut , Milk" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferences">Food Preferences (seperate by a comma)</Label>
            <Input id="preferences" type="text" placeholder="Beef , Chicken" />
          </div>
          <Button type="submit" className="w-full">
            Finish Customization
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
