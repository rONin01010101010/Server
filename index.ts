import express from 'express';
const app = express();
const port = 8080;
app.use("/app", express.static("./src/app"));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

