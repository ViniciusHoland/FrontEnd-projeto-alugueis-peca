import "./HomePage.css";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Badge,
  Container,
  Collapse,
  Row,
  Col,
} from "react-bootstrap";

function HomePage() {
  const [alugueis, setAlugueis] = useState([]);
  const [alugueisTotal, setAlugueisTotal] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // Estado para armazenar ID do aluguel sendo editado

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

      setAlugueis(response.data.alugueis || []);
      setAlugueisTotal(response.data.totalAlugueis);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Erro ao buscar alugueis");
    }
  };

  useEffect(() => {
    getAllAlugueis();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cadastrarOuEditarAluguel = async (e) => {
    e.preventDefault();
    try {

      console.log(formData)

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado");
        return;
      }

      const { clienteId, idPeca, quantidade, dataInicio, dataFim } = formData;

  

      if (editandoId) {
        const aluguelId = editandoId

        await api.put(
          `/alugueis/${aluguelId}`,
          {
            clienteId,
            idPeca,
            quantidade: parseInt(quantidade),
            dataInicio,
            dataFim
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Aluguel atualizado com sucesso!");
      } else {
        await api.post(
          "/alugueis/registro",
          {
            clienteId,
            idPeca,
            quantidade, 
            dataInicio: new Date(dataInicio).toISOString().split("T")[0],
            dataFim: new Date(dataFim).toISOString().split("T")[0],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        alert("Aluguel cadastrado com sucesso!");
      }

    
      setFormData({
        clienteId: "",
        idPeca: "",
        quantidade: "",
        dataInicio: "",
        dataFim: "",
      });
      setEditandoId(null);
      setShowForm(false);
      getAllAlugueis();

    } catch (err) {
      console.error("Erro ao cadastrar aluguel: ", err.response || err.message);
      alert("Erro ao cadastrar ou editar aluguel");
    }
  };


  const carregarAluguelParaEdicao = (aluguel) => {
    setEditandoId(aluguel.idAluguel);
    setFormData({
      clienteId: aluguel.idCliente,
      idPeca: aluguel.itens?.[0]?.idPeca || "",
      quantidade: aluguel.itens?.[0]?.quantidade || "",
      dataInicio: new Date(aluguel.dataInicio).toISOString().split("T")[0],
      dataFim: new Date(aluguel.dataFim).toISOString().split("T")[0],
    });

    console.log(aluguel)

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

  }

  return (
    <Container className="mt-4">
      <Collapse in={showForm}>
        <div className="mt-4">
          <h2 className="text-center">
            {editandoId ? "Editar Aluguel" : "Cadastro de Aluguel"}
          </h2>
          <Form
            onSubmit={cadastrarOuEditarAluguel}
            className="p-4 border rounded shadow-sm bg-light"
          >
            <Row className="mb-3">
              <Col md={2}>
                <Form.Label>ID do Cliente</Form.Label>
                <Form.Control
                  type="number"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={2}>
                <Form.Label>Peça</Form.Label>
                <Form.Select
                  name="idPeca"
                  value={formData.idPeca}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="1">Andaime</option>
                  <option value="0">Outro</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={3}>
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="date"
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={3}>
                <Form.Label>Data de Fim</Form.Label>
                <Form.Control
                  type="date"
                  name="dataFim"
                  value={formData.dataFim}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="w-100">
              {editandoId ? "Atualizar" : "Cadastrar"}
            </Button>
          </Form>
        </div>
      </Collapse>

      <h2 className="text-center">Consulta de Aluguéis</h2>

      <div className="d-flex justify-content-between mb-3">
        <span>Total de aluguéis: {alugueisTotal}</span>
        <Button
          variant="success"
          onClick={() => {
            setShowForm(!showForm);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {showForm ? "✖" : "+"}
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Peça</th>
            <th>Quantidade</th>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alugueis
            .filter((a) => a.status === "aberto")
            .map((aluguel, index) => (
              <tr key={index}>
                <td>{aluguel.idAluguel}</td>
                <td
                  onClick={() =>
                    navigate(`/alugueis/cliente/${aluguel.idCliente}`)
                  }
                >
                  {aluguel.nomeCliente}
                </td>
                <td>{aluguel.itens?.[0]?.peca || "N/A"}</td>
                <td>{aluguel.itens?.[0]?.quantidade || "N/A"}</td>
                <td>{new Date(aluguel.dataInicio).toLocaleDateString()}</td>
                <td>{new Date(aluguel.dataFim).toLocaleDateString()}</td>
                <td>
                  <Badge
                    bg={aluguel.status === "aberto" ? "success" : "danger"}
                  >
                    {aluguel.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => carregarAluguelParaEdicao(aluguel)}
                  >
                    ✏
                  </Button>
                </td>
                <td>
                  <Button variant="danger" size="sm">
                    🗑{" "}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default HomePage;
