const express = require("express");
const app = express();
const DB = require("./database").connectDB;
const authRouter = require("./routers/authRoutes");
const procRouter = require("./routers/procRoutes");
const prodRouter = require("./routers/prodRoutes");
const wareHouseRouter = require("./routers/warehouseRoutes");
const exportRouter = require("./routers/exportRoutes");
const supplyRoutes = require("./routers/supplyRoutes");
const cors = require('cors')

DB();
app.use(express.json());

app.use(cors());

app.use("/route", authRouter);
app.use("/Procurement", procRouter);
app.use("/Production", prodRouter);
app.use("/WareHouse", wareHouseRouter);
app.use("/Export", exportRouter);
app.use("/Supply", supplyRoutes);




app.listen(process.env.PORT, () => {
    console.log("listening on port:", +process.env.PORT);
})