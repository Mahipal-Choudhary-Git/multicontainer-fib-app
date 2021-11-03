const express = require("express");
const cors = require("cors");
const redis = require("redis");
const { Pool } = require("pg");

const keys = require("./keys");

// express server setup....
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// postgres pool setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});
pgClient.on("error", () => {
    console.log("lost pg coonection ");
});

pgClient
    .query("CREATE TABLE IF NOT EXISTS values (numbers INT)")
    .then((raw) => console.log(raw))
    .catch((err) => console.log(err));

// redis server connection
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// express route hadlers
app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/values", async (req, res) => {
    const values = await pgClient.query("SELECT * from values");
    res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
    redisClient.hgetall("values", (err, values) => {
        res.send(values);
    });
});

app.post("/values", async (req, res) => {
    const index = req.body.index;
    if (index > 40) res.status(422).send("Index Too High");

    redisClient.hset("values", index, "Nothing Yet");
    redisPublisher.publish("insert", index);

    pgClient.query("INSERT INTO values(numbers) VALUES($1)", [index]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log("server is running");
});
