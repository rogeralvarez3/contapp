const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const io = require("socket.io");
const db = require("./db");

app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {});
app.post("/list", (req, res) => {
  var data = req.body
  db.list(data,r=>{
    res.send(r)
  })
});
app.post("/save", (req, res) => {
  console.log(req.body)
  db.save(req.body,(r)=>{
    res.send(r)
  })
});
app.post("/delete", (req, res) => {
  db.delete(req.body,r=>{
    res.send(r)
  })
});

const port = process.env.port || "3000";
let svr = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

let socket = io.listen(svr);
socket.on("connection", (sck) => {
  console.log(`Cliente ${sck.id} conectado`);
  sck.on("disconnect", () => {
    console.log(`Cliente ${sck.id} desconectado`);
  });
});
