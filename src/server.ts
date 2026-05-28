import express = require("express")

const app = express()

app.use(express.json())

const VERIFY_TOKEN = "anext_verify_token"

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"]
    const token = req.query["hub.verify_token"]
    const challenge = req.query["hub.challenge"]

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge)
    }

    return res.sendStatus(403)
})

app.post("/webhook", async (req, res) => {
    try {
        console.log(JSON.stringify(req.body, null, 2))

        const message =
            req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

        if (!message) {
            return res.sendStatus(200)
        }

        const from = message.from
        const text = message.text?.body

        console.log("From:", from)
        console.log("Message:", text)

        return res.sendStatus(200)
    } catch (err) {
        console.error(err)
        return res.sendStatus(500)
    }
})

app.listen(3000, () => {
    console.log("Webhook server running on port 3000")
})