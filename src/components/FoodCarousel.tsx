// FoodCarousel.js
import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function FoodCarousel ({ foods }) {

  return (


<Carousel className="w-full max-w-xs">
<CarouselContent>
{foods.map((food, index) => (
    <CarouselItem key={index}>
      <div className="p-1">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
          <img src={food.image_link} alt={food.recipe_name} style={{ width: '100%', height: 'auto' }} />
            <h3>{food.recipe_name}</h3>
            <p>Calories: {food.calories}</p>
            <p>Carbs: {food.carbs}</p>
            <p>Proteins: {food.proteins}</p>
            <p>Serving Size: {food.serving_size}</p>
            <p>Ingredients: {food.ingredients}</p>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  ))}
</CarouselContent>
<CarouselPrevious />
<CarouselNext />
</Carousel>
  );
};


