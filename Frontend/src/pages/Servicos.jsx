import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { formatarPreco } from "../utils/formatarPreco.js";

function Servicos() {
  // 1. Estados
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const servicoSelecionado = Number(searchParams.get("servico"));

  // 2. Buscar os serviços quando a tela aparece
  useEffect(() => {
    async function buscarServicos() {
      try {
        const resposta = await api.get("/servicos");
        setServicos(resposta.data);
      } catch {
        setErro("Não foi possível carregar os serviços.");
      } finally {
        setCarregando(false);
      }
    }

    buscarServicos();
  }, []);

  if (carregando) {
    return <p className="p-5 text-suave">Carregando serviços...</p>;
  }

  if (erro) {
    return <p className="p-5 font-semibold text-red-700">{erro}</p>;
  }

  // 3. Sucesso: a lista
  return (
    <div className="min-h-screen bg-fundo text-tinta font-sans">
      <header className="px-5 pt-5 flex flex-col gap-1.5 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Qual serviço você quer?
        </h1>
        <p className="text-suave">Escolha um para ver os horários livres.</p>
      </header>

      <main className="p-5 flex flex-col gap-3">
        {servicos.map((servico) => {
          const selecionado = servico.id === servicoSelecionado;

          return (
            <button
              key={servico.id}
              type="button"
              onClick={() =>
                setSearchParams({ servico: servico.id }, { replace: true })
              }
              aria-pressed={selecionado}
              className={`flex items-center gap-3.5 p-4.5 rounded-2xl bg-white border-2 text-left  transition-colors focus-visible:outline-2 focus-visible:outline-azul focus-visible:outline-offset-2 ${
                selecionado
                  ? "border-azul"
                  : "border-borda hover:border-gray-400"
              }`}
            >
              <div className="grow flex flex-col gap-1">
                <span className="text-lg font-bold">{servico.nome}</span>
                <span className="text-sm text-suave">
                  {servico.duracaoMinutos} min
                </span>
              </div>
              <span className="text-lg font-bold">
                {formatarPreco(servico.preco)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          disabled={!servicoSelecionado}
          onClick={() => navigate(`/barbeiros?servico=${servicoSelecionado}`)}
          className="h-14 w-full rounded-2xl bg-azul text-white font-bold transition-colors hover:bg-blue-800 disabled:opacity-50 disabled:hover:bg-azul focus-visible:outline-2 focus-visible:outline-azul focus-visible:outline-offset-2 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </main>
    </div>
  );
}

export default Servicos;
