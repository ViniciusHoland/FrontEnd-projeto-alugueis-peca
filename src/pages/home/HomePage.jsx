import "./HomePage.css";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [alugueis, setAlugueis] = useState([]);
  const [alugueisTotal, setAlugueisTotal] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clienteId: "",
    idPeca: "",
    quantidade: "",
    dataInicio: "",
    dataFim: "",
  });


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


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const cadastrarAluguel = async (e) => {

    e.preventDefault()

    try{

     

      
        const token = localStorage.getItem('token')

        if (!token) {
            alert("Token não encontrado");
            return;
        }
        

        const idCliente = formData.clienteId
        const idPeca = formData.idPeca
        const quantidade = formData.quantidade
        const dataInicio = new Date(formData.dataInicio).toISOString().split('T')[0]
        const dataFim = new Date(formData.dataFim).toISOString().split('T')[0]


        const response = await api.post('/alugueis/registro', {

               idCliente,
               idPeca,
               quantidade,
               dataInicio,
               dataFim

            }, 
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
      
      )

      console.log(response)
      alert("Aluguel cadastrado com sucesso!")
      navigate('/home')



    } catch  (err) {
      console.error("Erro ao cadastrar aluguel: ", err.response);
      alert("Erro ao cadastrar aluguel");
    }
  }



  return (

    <div className="container">
    {/* 🔹 Formulário de Cadastro */}
    <div className="form-container">
      <h2>Cadastro de Aluguel</h2>
      <form onSubmit={cadastrarAluguel}>
        <div className="form-group">
          <label>ID do Cliente:</label>
          <input type="number" name="clienteId" value={formData.clienteId} onChange={handleChange} required />
        </div>
  
        <div className="form-group">
          <label>Peça:</label>
          <div className="radio-group">
            <input type="radio" name="idPeca" value="1" checked={formData.idPeca === "1"} onChange={handleChange} />
            <label>Andaime</label>
          </div>
        </div>
  
        <div className="form-group">
          <label>Quantidade:</label>
          <input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} required />
        </div>
  
        <div className="form-group">
          <label>Data de Início:</label>
          <input type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
        </div>
  
        <div className="form-group">
          <label>Data de Fim:</label>
          <input type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} required />
        </div>
  
        <button type="submit" className="btn-submit">Cadastrar</button>
      </form>
    </div>
  
    {/* 🔹 Tabela de Aluguéis */}
    <div className="pricing-container">
      <h1 className="pricing-title">Tabela de Alugueis</h1>
      <p className="pricing-subtitle">Total Alugueis: {alugueisTotal}</p>
  
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
            <button className="btn" onClick={() => navigate(`/alugueis/cliente/${aluguel.idCliente}`)}>➝</button>
          </div>
        ))}
      </div>
    </div>
  </div>
  

  );
};

export default HomePage;
