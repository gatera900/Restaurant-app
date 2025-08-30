async function loadRestaurants() {
  const response = await fetch("/restaurants");
  const restaurants = await response.json();
  const container = document.getElementById("restaurants");

  container.innerHTML = restaurants
    .map(
      (restaurant) => `
        <div class="restaurant-card">
            <h3>${restaurant.name}</h3>
            <p>Cuisine: ${restaurant.cuisine}</p>
            <p>Location: ${restaurant.location}</p>
        </div>
    `
    )
    .join("");
}

async function addRestaurant() {
  const name = prompt("Restaurant name:");
  if (!name) return;

  const restaurant = {
    id: Date.now(),
    name,
    cuisine: prompt("Cuisine type:"),
    location: prompt("Location:"),
  };

  await fetch("/restaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurant),
  });

  loadRestaurants();
}

loadRestaurants();
