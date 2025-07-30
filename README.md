# 👗 Fashion Store RESTful API

ระบบ RESTful API สำหรับร้านขายแฟชั่น (รองเท้า เสื้อผ้า ฯลฯ) ด้วย Node.js + Express  
ประกอบด้วย Users, Products, Orders และ Nested Resources: Product Reviews, Order Items

---
# 🧪 Postman Collection: API Shares

ใช้สำหรับทดสอบ RESTful API ที่พัฒนาโดย Scottxsh  
สามารถนำเข้าไปใน Postman เพื่อทดลองเรียกใช้งาน endpoint ต่าง ๆ ได้ทันที

## 🔗 ลิงก์สำหรับเปิดใช้งาน

👉 [เปิดใน Postman](https://www.postman.com/scottxsh/workspace/api-shares/collection/46027124-fd85a57a-595e-4986-8c64-af603a742249?action=share&creator=46027124)

## 📦 เนื้อหาใน Collection

- Authentication
- Users
- Products
- Orders
- Product Reviews
- Order Items
---
## 🚀 วิธีใช้งาน

1. เปิด XAMPP และลบโฟลเดอร์ `prisma/migrations` หากมีอยู่เดิม
2. สั่งรันคำสั่ง:
```bash
npm install        # ติดตั้งแพ็กเกจ
npm run db         # สร้างฐานข้อมูลและ Prisma schema
npm run seed       # เพิ่ม mock data
npm run dev        # เริ่มต้นเซิร์ฟเวอร์ (โหมดพัฒนา)
```
เซิร์ฟเวอร์จะทำงานที่:
```
http://localhost:5000
```

---

## 📦 API Endpoints

### 👤 Users

| Method | URI               | Description           |
|--------|-------------------|-----------------------|
| GET    | /users            | ดูผู้ใช้ทั้งหมด          |
| GET    | /users/:id        | ดูผู้ใช้รายคนตาม ID      |
| POST   | /users            | เพิ่มผู้ใช้ใหม่          |
| PATCH  | /users/:id        | แก้ไขข้อมูลผู้ใช้         |
| DELETE | /users/:id        | ลบผู้ใช้                |

### 🛍️ Products

| Method | URI               | Description           |
|--------|-------------------|-----------------------|
| GET    | /products         | ดูสินค้าทั้งหมด          |
| GET    | /products/:id     | ดูสินค้ารายตัวตาม ID     |
| POST   | /products         | เพิ่มสินค้าใหม่          |
| PATCH  | /products/:id     | แก้ไขข้อมูลสินค้า         |
| DELETE | /products/:id     | ลบสินค้า                |

### ✍️ Product Reviews (Nested)

| Method | URI                             | Description            |
|--------|----------------------------------|------------------------|
| GET    | /products/:productId/reviews     | ดูรีวิวสินค้านั้นทั้งหมด |
| POST   | /products/:productId/reviews     | เพิ่มรีวิวให้สินค้า       |

### 📦 Orders

| Method | URI               | Description           |
|--------|-------------------|-----------------------|
| GET    | /orders           | ดูคำสั่งซื้อทั้งหมด       |
| GET    | /orders/:id       | ดูคำสั่งซื้อรายตัว        |
| POST   | /orders           | สร้างคำสั่งซื้อใหม่        |
| DELETE | /orders/:id       | ลบคำสั่งซื้อ             |

### 🧾 Order Items (Nested)

| Method | URI                           | Description               |
|--------|--------------------------------|---------------------------|
| GET    | /orders/:orderId/items         | ดูรายการสินค้าภายในคำสั่งซื้อ |
| POST   | /orders/:orderId/items         | เพิ่มสินค้าลงในคำสั่งซื้อ     |

---

## 🧪 ตัวอย่าง Request (Postman)

### POST /users
```json
{
  "username": "mintmint",
  "email": "mint@example.com",
  "password": "1234"
}
```

### POST /products
```json
{
  "name": "Nike Air Force 1",
  "category": "shoes",
  "price": 3900
}
```

### POST /products/1/reviews
```json
{
  "userId": 1,
  "rating": 5,
  "comment": "ของแท้แน่นอน ใส่สบายมาก!"
}
```

### POST /orders
```json
{
  "userId": 1
}
```

### POST /orders/1/items
```json
{
  "productId": 2,
  "quantity": 1
}
```

---

## 🛠 Stack ที่ใช้

- Node.js
- Express.js
- Prisma + MySQL
- body-parser
- CORS

---

## 📝 หมายเหตุ

- โครงการนี้ใช้ Prisma เชื่อมต่อกับฐานข้อมูล MySQL
- เหมาะสำหรับใช้ฝึก RESTful API และทดสอบกับ Postman
