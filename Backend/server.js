import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./config/conn.js";

//import associations
import "./models/associations.js";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());


//importe das rotas
import ServicoRoutes from "./routes/ServicoRoutes.js";
import BarbeiroRoutes from "./routes/BarbeiroRoutes.js"; 
import AgendamentoRoutes from "./routes/AgendamentoRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js"

//rotas
app.use("/servicos", ServicoRoutes);
app.use("/barbeiros", BarbeiroRoutes); 
app.use("/agendamentos", AgendamentoRoutes);
app.use("/login", AuthRoutes)


// Rota de health check
app.get("/", (req, res) => {
  res.json({
    message: "API barberSystem is running",
  });
});


const PORT = process.env.PORT || 3000;

sequelize
.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
})
.catch((error) => {
    console.log("Erro ao conectar ao banco de dados:", error);
});
