import "./HomePage.css";
import api from "../../services/api";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [alugueis, setAlugueis] = useState([]);
    const [alugueisTotal, setAlugueisTotal] = useState(null);
    const navigate = useNavigate();

    const getAllAlugueis = async () => {
        try {

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token não encontrado");
                return;
            }

            const response = await api.get("/alugueis", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log(response.data.alugueis);

            setAlugueis(response.data.alugueis);
            setAlugueisTotal(response.data.totalAlugueis);

            
        } catch (err) {
            console.error(err.response.data);
            alert("Erro ao buscar alugueis");
        }
    };

    const formatData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };


      

    useEffect(() => {
        getAllAlugueis();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps




    return (
  
    <div className="pricing-container">
      <h1 className="pricing-title">Tabela de Alugueis</h1>
      <p className="pricing-subtitle">
        Total Alugeis: {alugueisTotal}
      </p>
      <div className="pricing-cards">

        {alugueis.filter(aluguel => aluguel.status === "aberto").map(aluguel => (
          
            <div key={aluguel.id} className="card">
                <h2>{aluguel.nomeCliente}</h2>
                <p className="price">R$ {aluguel.valorTotal}</p>
                {aluguel.itens.map(item => (
                    <ul key={item.id}>
                        <p className="card-subtitle">{item.peca}</p>
                        <li>Status: {aluguel.status}</li>
                        <li>Quantidade: {item.quantidade}</li>
                        <li>ValorUnitario: R$ {item.precoUnitario}</li>
                        <li>Retirada: {formatData(aluguel.dataInicio.split('T')[0])}</li>
                        <li>Entrega: {formatData(aluguel.dataFim.split('T')[0])}</li>
                    </ul>   
                 
           ))}
            <button className="btn" onClick={() => navigate(`/alugueis/cliente/${aluguel.idCliente}`)} >➝</button>
            </div>
        ))}

      </div>
    </div>
  );
};

export default HomePage;
