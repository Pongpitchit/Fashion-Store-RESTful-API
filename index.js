const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// 🔐 JWT Secrets
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "refresh-secret";

let refreshTokens = [];

// ✅ Middleware: ตรวจสอบ JWT Access Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1];
  const cookieToken = req.cookies.accessToken;

  const token = bearerToken || cookieToken;

  if (!token) return res.status(401).json({ message: "no access token" });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid or expired token" });
    req.user = user;
    next();
  });
}

// ✅ REGISTER
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = await prisma.user.create({
      data: { username, email, password },
    });

    res.status(201).json({ message: "User registered", userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error" });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const existingRefresh = req.cookies.refreshToken;
    if (existingRefresh && refreshTokens.includes(existingRefresh)) {
      return res.status(400).json({ message: "คุณได้เข้าสู่ระบบแล้ว กรุณา logout ก่อน" });
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    
    refreshTokens.push(refreshToken);

    // ✅ เซ็ตเฉพาะ refreshToken ลง cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token:{accessToken, refreshToken}, message: "Login success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// ✅ REFRESH TOKEN
app.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid or missing refresh token" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired" });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ ส่ง accessToken ลง cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Access Token refreshed" });
  });
});

// ✅ LOGOUT
app.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  }

  // เคลียร์คุกกี้
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
});


// ✅ Protected Test Route
app.get("/profile", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true },
  });

  res.json(user);
});

// ✅ Routes
app.use("/users", userRoutes);                         
app.use("/products", authenticateToken, productRoutes);
app.use("/orders", authenticateToken, orderRoutes);

// ✅ Home route
app.get("/", (req, res) => res.send("👗 FashionStore API is running"));

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
