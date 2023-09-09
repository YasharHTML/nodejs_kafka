import { Router, Express } from "express";
import { Producer } from "kafkajs";

export async function generateRouter(app: Express, producer: Producer) {
    await producer.connect();

    const router = Router();

    router.get("/", (req, res) => {
        producer
            .send({ topic: "main-topic", messages: [{ value: "hello" }] })
            .then((value) => res.send(value));
    });

    app.use("/api/user", router);
}
