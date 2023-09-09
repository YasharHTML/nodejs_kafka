import express from "express";
import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";
import { generateRouter } from "./router";
dotenv.config();

const PORT = process.env.PORT ?? 3000;
const KAFKA_SERVER = process.env.KAFKA_SERVER!;

const app = express();

const kafka = new Kafka({ brokers: [KAFKA_SERVER] });

generateRouter(app, kafka.producer());

(async () => {
    const consumer = kafka.consumer({ groupId: "main-topic" });
    await consumer.connect();
    await consumer.subscribe({ topic: "main-topic", fromBeginning: true });
    await consumer.run({
        eachMessage: async (payload) => {
            console.log(payload.message.value?.toString());
        },
    });
})();

app.listen(PORT, () => console.log("Listening on PORT: " + PORT));
