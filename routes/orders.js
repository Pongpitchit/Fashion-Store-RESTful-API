const express = require("express");
const router = express.Router();
const prisma = require('../lib/prisma'); // Import Prisma Client

// 🔹 GET /orders - ดูคำสั่งซื้อทั้งหมด
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true, // รวม orderItems ด้วย
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 🔹 GET /orders/:id - ดูคำสั่งซื้อรายรายการ
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// 🔹 POST /orders - สร้างคำสั่งซื้อใหม่
router.post("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        userId
      }
    });
    res.status(201).json(order);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error creating order" });
  }
});

// 🔹 DELETE /orders/:id - ลบคำสั่งซื้อ
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // ลบ order items ที่เกี่ยวข้องก่อน
    await prisma.orderItem.deleteMany({
      where: {
        orderId: id
      }
    });

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

// 🔹 GET /orders/:orderId/items - ดูสินค้าในคำสั่งซื้อ
router.get("/:orderId/items", async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order items" });
  }
});

// 🔹 POST /orders/:orderId/items - เพิ่มสินค้าเข้าไปในคำสั่งซื้อ
router.post("/:orderId/items", async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { productId, quantity } = req.body;

  try {
    // ตรวจสอบว่ามี order จริงหรือไม่
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity
      }
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Error adding item to order" });
  }
});

module.exports = router;
