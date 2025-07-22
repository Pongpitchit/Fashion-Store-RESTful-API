const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma"); // Import Prisma Client

// 🔹 GET /products - ดึงสินค้าทั้งหมด
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// 🔹 GET /products/:id - ดึงสินค้าตาม ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true }
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// 🔹 POST /products - เพิ่มสินค้าใหม่
router.post("/", async (req, res) => {
  const { name, category, price } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, category, price }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// 🔹 PATCH /products/:id - แก้ไขสินค้า
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, price } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, category, price }
    });
    res.json(product);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error updating product" });
    }
  }
});

// 🔹 DELETE /products/:id - ลบสินค้า
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
});

// 🌟 NESTED: GET /products/:productId/reviews
router.get("/:productId/reviews", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: true }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// 🌟 NESTED: POST /products/:productId/reviews
router.post("/:productId/reviews", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const { userId, rating, comment } = req.body;

  try {
    // ตรวจสอบว่า productId มีจริงไหม
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error creating review" });
  }
});

module.exports = router;
