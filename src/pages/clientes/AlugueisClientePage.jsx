import "bootstrap/dist/css/bootstrap.min.css";
import "./AlugueisCliente.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AlugueisClientePage() {
    const { idCliente } = useParams();
    const [alugueis, setAlugueis] = useState([]);

    useEffect(() => {
        getAllAlugueisCliente();
    }, [idCliente]);

    const getAllAlugueisCliente = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token não encontrado");
                return;
            }
            const response = await api.get(`/alugueis/cliente/${idCliente}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlugueis(response.data.alugueis);
        } catch (err) {
            console.error("Erro ao buscar aluguéis do cliente: ", err);
            alert("Erro ao buscar aluguéis do cliente");
        }
    };

    const fecharStatus = async (aluguelId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token não encontrado");
                return;
            }
            await api.put(`/alugueis/status/${aluguelId}`, { status: "fechado" }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Status do aluguel fechado com sucesso!");
            getAllAlugueisCliente();
        } catch (err) {
            console.error("Erro ao fechar status do aluguel: ", err);
            alert("Erro ao fechar status do aluguel");
        }
    };

    const formatData = (data) => new Date(data).toLocaleDateString('pt-BR');

    const formatCurrency = (value) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

    const imprimirPDF = async (aluguel) => {
        try {
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [100, 180] });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("CAMILOS CONSTRUÇÕES", 50, 10);

            doc.setFontSize(10);
            doc.text("(84) 9 9965-2007", 50, 15);
            doc.text("ENDEREÇO DA SUA LOJA", 50, 20);
            doc.text("-------------------------------------", 50, 25);

            const data = new Date().toLocaleString();
            
            doc.setFont("helvetica", "normal");
            doc.text(`Emissão: ${data}`, 10, 30);
            doc.text(`Fone: ${aluguel.telefone}`, 60, 30);
            doc.text(`Cliente: ${aluguel.nomeCliente}`, 10, 35);
            doc.text(`Endereço: ${aluguel.endereco.rua}, ${aluguel.endereco.numero}, ${aluguel.endereco.bairro}`, 10, 40);

            let valorTotal = 0;

            const colunas = ["Qtd", "Descrição", "Retirada", "Entrega", "Dias", "Unit", "Total"];
            const dados = aluguel.itens.map((item) => {
                const total = item.quantidade * item.precoUnitario * aluguel.quantidadeDias;
                valorTotal += total;
                return [
                    item.quantidade,
                    item.peca,
                    formatData(aluguel.dataInicio),
                    formatData(aluguel.dataFim),
                    aluguel.quantidadeDias,
                    formatCurrency(item.precoUnitario),
                    formatCurrency(total)
                ];
            });

            autoTable(doc, {
                startY: 45,
                head: [colunas],
                body: dados,
                theme: "grid",
                styles: { fontSize: 10, cellPadding: 2 },
                columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 15 }, 5: { cellWidth: 20 }, 6: { cellWidth: 25 } }
            });

            let finalY = doc.lastAutoTable.finalY + 5;
            doc.text(`Total: ${formatCurrency(valorTotal)}`, 140, finalY);

            doc.text("_____________________", 10, finalY + 15);
            doc.text("Ass. Comprador", 15, finalY + 20);
            doc.text("_____________________", 60, finalY + 15);
            doc.text("Assinatura Loja", 65, finalY + 20);

            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);

            //if (newWindow) newWindow.onload = () => newWindow.print();

        } catch (err) {
            console.error("Erro ao imprimir PDF: ", err.message);
            alert("Erro ao imprimir PDF");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista de Aluguéis</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Cliente</th>
                            <th>Status</th>
                            <th>Peça</th>
                            <th>Quantidade</th>
                            <th>Data Entrega</th>
                            <th>Data Saída</th>
                            <th>Quat. Dias</th>
                            <th>Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alugueis
                        .sort((a) => a.status === "fechado" ? 1 : -1)
                        .map(aluguel =>
                            aluguel.itens.map(item => (
                                <tr key={`${aluguel.idAluguel}-${item.id}`} className="text-center">
                                    <td>{aluguel.nomeCliente}</td>
                                    <td className={aluguel.status === "fechado" ? "text-danger" : "text-success"}>{aluguel.status}</td>
                                    <td>{item.peca}</td>
                                    <td>{item.quantidade}</td>
                                    <td>{formatData(aluguel.dataInicio)}</td>
                                    <td>{formatData(aluguel.dataFim)}</td>
                                    <td>{aluguel.quantidadeDias}</td>
                                    <td>{formatCurrency(aluguel.quantidadeDias *  item.quantidade * item.precoUnitario)}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm me-2" onClick={() => fecharStatus(aluguel.idAluguel)}>❌</button>
                                
                                    </td>
                                    <td>
                                    <button className="btn btn-primary btn-sm" onClick={() => imprimirPDF(aluguel)}>🖨️</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AlugueisClientePage;
