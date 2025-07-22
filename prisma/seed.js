const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ลบข้อมูลเก่าก่อน (ระวังการใช้ใน Production!)
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 🔹 Users
  const user1 = await prisma.user.create({
    data: {
      username: "mintmint",
      email: "mint@example.com",
      password: "1234"
    }
  });
  const user2 = await prisma.user.create({
    data: {
      username: "johnny",
      email: "johnny@example.com",
      password: "abcd1234"
    }
  });

  // 🔹 Products
  const product1 = await prisma.product.create({
    data: {
      name: "Nike Air Force 1",
      category: "shoes",
      price: 3900
    }
  });
  const product2 = await prisma.product.create({
    data: {
      name: "Oversized Denim Jacket",
      category: "clothing",
      price: 1990
    }
  });

  // 🔹 Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: product1.id,
        userId: user1.id,
        rating: 5,
        comment: "ใส่สบายสุดๆ ของแท้!"
      },
      {
        productId: product2.id,
        userId: user2.id,
        rating: 4,
        comment: "เนื้อผ้าดี ส่งเร็วมาก"
      }
    ]
  });

  // 🔹 Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      date: new Date("2025-07-06T14:30:00Z")
    }
  });
  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      date: new Date("2025-07-07T10:15:00Z")
    }
  });

  // 🔹 OrderItems
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: product1.id,
        quantity: 2
      },
      {
        orderId: order1.id,
        productId: product2.id,
        quantity: 1
      },
      {
        orderId: order2.id,
        productId: product2.id,
        quantity: 3
      }
    ]
  });

  console.log("✅ Seed data inserted successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
