const db = require("./db");

// Seed data with stable, high-quality Unsplash image URLs (hotlink & CORS friendly)
const dishes = [
  {
    dishId: "1",
    dishName: "Chicken Biryani",
    imageUrl:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: true,
  },
  {
    dishId: "2",
    dishName: "Paneer Butter Masala",
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: false,
  },
  {
    dishId: "3",
    dishName: "Masala Dosa",
    imageUrl:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: true,
  },
  {
    dishId: "4",
    dishName: "Butter Chicken",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: true,
  },
  {
    dishId: "5",
    dishName: "Dal Makhani",
    imageUrl:
      "https://images.unsplash.com/photo-1736680056463-8b5e0fd9357e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: false,
  },
  {
    dishId: "6",
    dishName: "Palak Paneer",
    imageUrl:
      "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPublished: true,
  },
  {
    dishId: "7",
    dishName: "Chole Bhature",
    imageUrl:
      "https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.jpg?s=1024x1024&w=is&k=20&c=lKc3ytQPxxWtop4r7mgg6aNV_Z1Oe_2pAJYuXhTfhgE=",
    isPublished: false,
  },
  {
    dishId: "8",
    dishName: "Aloo Paratha",
    imageUrl:
      "https://media.istockphoto.com/id/1279134709/photo/image-of-metal-tray-with-aloo-paratha-pile-topped-with-red-onion-rings-and-sprinkle-of.jpg?s=1024x1024&w=is&k=20&c=UFLE_PNGPe83flTXa-r-ZnIxysesQZk5cxlUkq3H1o0=",
    isPublished: true,
  },
];

// Use INSERT OR REPLACE so updates to these image URLs take effect immediately on next startup
const insertDish = db.prepare(`
  INSERT OR REPLACE INTO dishes (dishId, dishName, imageUrl, isPublished)
  VALUES (@dishId, @dishName, @imageUrl, @isPublished)
`);

const seedAll = db.transaction((dishes) => {
  for (const dish of dishes) {
    insertDish.run({
      ...dish,
      isPublished: dish.isPublished ? 1 : 0,
    });
  }
});

seedAll(dishes);

console.log(
  "✅ Database seeded/updated successfully with",
  dishes.length,
  "dishes.",
);
