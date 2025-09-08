from contextlib import asynccontextmanager
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import create_tables, get_db, Product

class ProductDTO(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None
    stock: int
    
    class Config:
        from_attributes = True

class ProductCreateDTO(BaseModel):
    name: str
    price: float
    description: str | None = None
    stock: int

class ProductUpdateDTO(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    stock: int | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield



app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/products/", response_model=ProductDTO)
async def create_product(product_dto: ProductCreateDTO, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.name == product_dto.name))
    db_product = result.first()

    if db_product:
        raise HTTPException(status_code=400, detail="Product with this name already exists")

    new_product = Product(name=product_dto.name, description=product_dto.description, price=product_dto.price, stock=product_dto.stock)
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

@app.get("/products/", response_model=List[ProductDTO])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return products

@app.put("/products/{id}", response_model=ProductDTO)
async def update_product(id: int, product_dto: ProductUpdateDTO, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == id))
    db_product = result.scalar_one_or_none()

    if not db_product:
        raise HTTPException(status_code=400, detail="Product does not exist")

    if product_dto.name:
        db_product.name = product_dto.name

    if product_dto.price:
        db_product.price = product_dto.price

    if product_dto.description:
        db_product.description = product_dto.description
    
    if product_dto.stock:
        db_product.stock = product_dto.stock
    
    await db.commit()
    await db.refresh(db_product)
    return db_product

@app.delete("/products/{id}")
async def delete_product(id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(delete(Product).where(Product.id == id))
    await db.commit()
    print(f'Product with id {id} deleted')
    return {}

@app.get("/products/{id}", response_model=ProductDTO)
async def get_product_by_id(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == id))
    db_product = result.scalar_one_or_none()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product does not exist")
    return db_product


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
