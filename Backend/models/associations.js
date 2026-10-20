import Cliente from "./Cliente.js";
import Barbeiro from "./Barbeiro.js";
import Servico from "./Servico.js";
import Agendamento from "./Agendamento.js";

Cliente.hasMany(Agendamento, { foreignKey: "clienteId" });
Agendamento.belongsTo(Cliente, { foreignKey: "clienteId" });

Servico.hasMany(Agendamento, { foreignKey: "servicoId" });
Agendamento.belongsTo(Servico, { foreignKey: "servicoId" });

Barbeiro.hasMany(Agendamento, { foreignKey: "barbeiroId" });
Agendamento.belongsTo(Barbeiro, { foreignKey: "barbeiroId" });

export { Cliente, Barbeiro, Servico, Agendamento };