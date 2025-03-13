import "./AlugueisCliente.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api"



function AlugueisClientePage() {

    const { idCliente } = useParams()
    const [alugueis, setAlugueis] = useState([]);

    useEffect(() => {

        const getAllAlugueisCliente = async () => {
            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Token não encontrado");
                    return;
                }

                const response = await api.get(`/alugueis/cliente/${idCliente}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setAlugueis(response.data.alugueis);
                console.log(response.data);


            } catch (err) {
                console.error("Error ao buscar alugueis do cliente: ", err.response.data);
                alert("Erro ao buscar alugueis do cliente");
                return;
            }
        }

        getAllAlugueisCliente()

    }, [idCliente])

    const formatData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    return (

        <div className="container">
            {alugueis.map(aluguel => (
                <div key={aluguel.id} className="aluguel-card">
                    <h2 className="cliente-nome">{aluguel.nomeCliente}</h2>

                    <div className="tabela">
                        {/* Cabeçalho */}
                        <div className="tabela-header">
                            <span>Peça</span>
                            <span>Quantidade</span>
                            <span>Data Entrega</span>
                            <span>Data Saída</span>
                            <span>Ações</span>
                        </div>

                        {/* Linhas de itens */}
                        {aluguel.itens.map(item => (
                            <div key={item.id} className="tabela-linha">
                                <span className="peca">{item.peca}</span>
                                <span>{item.quantidade}</span>
                                <span>{formatData(aluguel.dataInicio.split('T')[0])}</span>
                                <span>{formatData(aluguel.dataFim.split('T')[0])}</span>
                                <div className="acoes">
                                    <button className="btn btn-close" onClick={() => fecharStatus(aluguel.id)}>
                                        ❌
                                    </button>
                                    <button className="btn btn-print" onClick={() => imprimirPDF(aluguel)}>
                                        🖨️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>


    )


}

export default AlugueisClientePage;