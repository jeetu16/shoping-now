import app from "./app.js";
import mongoose from "mongoose";
import config from "./config/index.js";
( async()=> {

    try {
        mongoose.connect(config.MONGO_DB_URL);
        console.log("Database successfully connected")

        app.on('error', (err) => {
            console.error("ERROR: ",err.message)
            throw err.message
        })

        const onListening = () => {
            console.log("Server is Listening on port 5000");
        }

        app.listen(config.PORT, onListening)
    } catch(err) {
        console.error("ERROR: ", err.message);
        throw err.message;
    }
})();