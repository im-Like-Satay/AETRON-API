const express = require("express");
const bodyParser = require("body-parser");
const response = require("./config/response");
// const aiCore = require("./lib/aiCore");  // dicomment dulu api key nya ke apus maap 🗿🙏 
const pool = require("./config/conection");
const app = express();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

/*
  Comment in devlopment, and uncomment in production or deployment
*/
// aiCore();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); // Admin dasboard

app.get("/api/v1/energy/status", (req, res) => {
    sql = `SELECT * FROM energy_logs`;

    pool.query(sql, (err, result) => {
      if (err) return response(500, null, "server error", res);
      return response(200, result.rows, "Energy status retrieved successfully", res);
    });
}); // Status energi

app.post("/api/v1/chat", (req, res) => {
  const inputMessage = req.body.input;
  const sql = `SELECT battery_level FROM energy_logs ORDER BY id DESC LIMIT 1;`;

  pool.query(sql, (err, result) => {
    if (err) return response(500, err, "server error", res);  
    if (!inputMessage) return response(400, null, "Input message is required", res);
    const data = result.rows[0].battery_level;
    
    let responseMessage = "";
    if (inputMessage === "status") responseMessage = `Energi ${data}%, saldo aman`;
    else if (inputMessage === "siapa admin") responseMessage = 'Surya';
    else return response(400, null, "perintah tidak dikenali", res);

    pool.query(`INSERT INTO chats_history (user_id, message, sender, timestamp) VALUES ($1, $2, $3, $4)`, 
      [1, inputMessage, "user", new Date()]);
    pool.query(`INSERT INTO chats_history (user_id, message, sender, timestamp) VALUES ($1, $2, $3, $4)`, 
      [1, responseMessage, "bot", new Date()]);

    return response(200, responseMessage, "Get data success", res);
  })
}); // Chat feature

app.get("/api/v1/chat", (req, res) => {
  const sql = `SELECT * FROM chats_history ORDER BY timestamp ASC LIMIT 50`;
  
  pool.query(sql, (err, result) => {
    if (err) return response(500, null, "server error", res);
    return response(200, result.rows, "Chat history retrieved successfully", res);
  });
}); // Get chat history

app.post("/api/v1/emergency/shutdown", (req, res) => {
  sql = `INSERT INTO sectors (sector_name, is_active) VALUES ($1, $2);`;

  pool.query(sql, [req.body.sector_name, false], (err, result) => {
    if (err) return response(500, null, "server error", res);
    if (req.body.sector_name === undefined) return response(400, null, "sector_name is required", res);
    if (req.body.is_active !== false) return response(400, null, "is_active must be false", res);
    if (result.rowCount === 0) return response(400, null, "Failed to shutdown sector", res);
    return response(201, result.rows, "Sector shutdown successfully", res);
  });
}); // Shutdown

app.post("/api/v1/auth/register", async (req, res) => {
  const { email, username, pass } = req.body;
  const hashedPassword = await bcrypt.hash(pass, 10);
  const sql = `INSERT INTO users (email, username, pass) VALUES ($1, $2, $3)`;

  pool.query(sql, [email, username, hashedPassword], (err, result) => {
    if (err) return response(500, err.message, "server error", res);
    return response(201, null, "User registered successfully", res);
  });
}); // Register

app.post("/api/v1/auth/login", async (req, res) => {
  const { email, username, pass } = req.body;
  const sql = `SELECT * FROM users WHERE username = $1 OR email = $1;`;
  pool.query(sql, [username || email], async (err, result) => {
    if (err) return response(500, null, "server error", res);
    if (result.rows.length === 0) return response(400, null, "User not found", res);
    const isMatch = await bcrypt.compare(pass, result.rows[0].pass);
    if (!isMatch) return response(400, null, "Invalid password", res);
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
    return response(200, { token }, "Login successfuly", res);
  });
}); // Login


app.get("/api/v1/events", (req, res) => {
  const eventData = [
    {
      id: 1,
      title: "Festival Musik",
      lat: -6.200000,
      lng: 106.816666,
      icon: "https://cdn-icons-png.flaticon.com/512/861/861646.png"
    },
    {
      id: 2,
      title: "Pasar Kreatif",
      lat: -6.210000,
      lng: 106.826666,
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
    },
    {
      id: 3,
      title: "Pameran Seni",
      lat: -6.205000,
      lng: 106.830000,
      icon: "https://cdn-icons-png.flaticon.com/512/1251/1251338.png"
    }
  ];

  return response(200, eventData, "Events retrieved successfully", res);

});

// POST tambah event baru
app.post("/api/v1/events", (req, res) => {
  const { title, lat, lng, icon } = req.body;
  if (!title || lat == null || lng == null)
    return response(400, null, "title, lat, lng wajib diisi", res);

  fs.readFile(eventsPath, 'utf8', (err, data) => {
    if (err) return response(500, null, "server error", res);
    const events = JSON.parse(data);
    const newEvent = { id: Date.now(), title, lat, lng, icon: icon || null };
    events.push(newEvent);
    fs.writeFile(eventsPath, JSON.stringify(events, null, 2), err => {
      if (err) return response(500, null, "Gagal menyimpan event", res);
      return response(201, newEvent, "Event added successfully", res);
    });
  });
});

// app.post("/api/v1/energy/switch-source", (req, res) => {});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
