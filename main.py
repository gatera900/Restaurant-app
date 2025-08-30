from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# In-memory storage
restaurants = []
orders = []

class Restaurant(BaseModel):
    id: int
    name: str
    cuisine: str
    location: str

class Order(BaseModel):
    id: int
    restaurant_id: int
    items: list[str]
    status: str = "pending"

@app.get("/")
def read_root():
    return FileResponse("static/index.html")

@app.get("/restaurants")
def get_restaurants():
    return restaurants

@app.post("/restaurants")
def create_restaurant(restaurant: Restaurant):
    restaurants.append(restaurant)
    return restaurant

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)