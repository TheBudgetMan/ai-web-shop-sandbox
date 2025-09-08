from contextlib import asynccontextmanager
from typing import List
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_serializer
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config import settings
from database import create_tables, get_db, Product, CartItem

class ProductDTO(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None
    stock: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
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


class CartItemDTO(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductDTO
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True

class AddToCartDTO(BaseModel):
    product_id: int
    quantity: int = 1

class UpdateCartItemDTO(BaseModel):
    quantity: int

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


# Cart endpoints
@app.post("/cart/", response_model=CartItemDTO)
async def add_to_cart(cart_dto: AddToCartDTO, db: AsyncSession = Depends(get_db)):
    # Check if product exists and has sufficient stock
    result = await db.execute(select(Product).filter(Product.id == cart_dto.product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.stock < cart_dto.quantity:
        raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {product.stock}")
    
    # Check if item already exists in cart
    cart_result = await db.execute(select(CartItem).filter(CartItem.product_id == cart_dto.product_id))
    existing_cart_item = cart_result.scalar_one_or_none()
    
    if existing_cart_item:
        # Update quantity if item already in cart
        total_quantity = existing_cart_item.quantity + cart_dto.quantity
        if product.stock < total_quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {product.stock}, Already in cart: {existing_cart_item.quantity}")
        
        existing_cart_item.quantity = total_quantity
        await db.commit()
        await db.refresh(existing_cart_item)
        
        # Load the product relationship
        result = await db.execute(
            select(CartItem).options(selectinload(CartItem.product)).filter(CartItem.id == existing_cart_item.id)
        )
        cart_item_with_product = result.scalar_one()
        return cart_item_with_product
    else:
        # Create new cart item
        new_cart_item = CartItem(product_id=cart_dto.product_id, quantity=cart_dto.quantity)
        db.add(new_cart_item)
        await db.commit()
        await db.refresh(new_cart_item)
        
        # Load the product relationship
        result = await db.execute(
            select(CartItem).options(selectinload(CartItem.product)).filter(CartItem.id == new_cart_item.id)
        )
        cart_item_with_product = result.scalar_one()
        return cart_item_with_product


@app.get("/cart/", response_model=List[CartItemDTO])
async def get_cart_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItem).options(selectinload(CartItem.product)))
    cart_items = result.scalars().all()
    return cart_items


@app.put("/cart/{cart_item_id}", response_model=CartItemDTO)
async def update_cart_item(cart_item_id: int, update_dto: UpdateCartItemDTO, db: AsyncSession = Depends(get_db)):
    # Get cart item
    result = await db.execute(select(CartItem).filter(CartItem.id == cart_item_id))
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # Get associated product to check stock
    product_result = await db.execute(select(Product).filter(Product.id == cart_item.product_id))
    product = product_result.scalar_one()
    
    if product.stock < update_dto.quantity:
        raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {product.stock}")
    
    cart_item.quantity = update_dto.quantity
    await db.commit()
    await db.refresh(cart_item)
    
    # Load the product relationship
    result = await db.execute(
        select(CartItem).options(selectinload(CartItem.product)).filter(CartItem.id == cart_item.id)
    )
    cart_item_with_product = result.scalar_one()
    return cart_item_with_product


@app.delete("/cart/{cart_item_id}")
async def remove_from_cart(cart_item_id: int, db: AsyncSession = Depends(get_db)):
    await db.execute(delete(CartItem).where(CartItem.id == cart_item_id))
    await db.commit()
    return {"message": "Item removed from cart"}


@app.delete("/cart/")
async def clear_cart(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(CartItem))
    await db.commit()
    return {"message": "Cart cleared"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
