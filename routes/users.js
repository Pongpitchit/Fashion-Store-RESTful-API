const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma"); // Import Prisma Client

// 🔹 GET /users - ดึงผู้ใช้ทั้งหมด
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// 🔹 GET /users/:id - ดึงผู้ใช้ตาม ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// 🔹 POST /users - เพิ่มผู้ใช้ใหม่
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});

// 🔹 PATCH /users/:id - แก้ไขข้อมูลผู้ใช้
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email, password } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { username, email, password },
    });
    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Error updating user" });
    }
  }
});

// 🔹 DELETE /users/:id - ลบผู้ใช้
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
});

module.exports = router;
