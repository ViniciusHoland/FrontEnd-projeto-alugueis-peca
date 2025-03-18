import "./AlugueisCliente.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";




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



    const fecharStatus = async (aluguelId) => {

        try {

            const token = localStorage.getItem('token')

            if (!token) {
                alert("Token não encontrado");
                return;
            }




            const closedAluguel = await api.put(`/alugueis/${aluguelId}`, { status: "fechado" }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (closedAluguel.status === 200) {
                alert("Status do aluguel fechado com sucesso!");
                setAlugueis(alugueis.filter(a => a.id !== aluguelId));
            } else {
                alert("Erro ao fechar status do aluguel");
            }

            console.log(closedAluguel.data)


        } catch (err) {
            console.error("Erro ao fechar status do aluguel: ", err.response.data);
            alert("Erro ao fechar status do aluguel");
            return;
        }



    }

    const imprimirPDF = async (aluguel) => {

        try {

            console.log(aluguel)

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [100, 180] // Define o tamanho do recibo (10 cm x 14 cm)
            });

            // 📌 Cabeçalho
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("CAMILOS CONSTRUÇÕES",50,10)

            doc.setFontSize(10);
            doc.text("(84) 9 9965-2007", 50, 15);
            doc.text("ENDEREÇO DA SUA LOJA", 50, 20);
            doc.text('-------------------------------------',50,25)

            const data = new Date().toLocaleString()
            
            doc.setFont("helvetica", "normal");
            doc.text(`Emissão: ${data}`, 10, 30);
            doc.text(`Fone: ${aluguel.telefone}`, 60, 30);
            doc.text(`Cliente: ${aluguel.nomeCliente}`, 10, 35);
            doc.text(`Endereço: ${aluguel.endereco.rua}, ${aluguel.endereco.numero}, ${aluguel.endereco.bairro}`, 10, 40);

            let valorTotal = 0

            // 📌 Tabela de produtos/serviços
            const colunas = ["Qtd", "Descrição", "Retirada", "Entrega", "Dias", "Unit", "Total"];
            const dados = aluguel.itens.map((item) => [
                item.quantidade,
                item.peca,
                new Date(aluguel.dataInicio).toLocaleDateString("pt-BR"),
                new Date(aluguel.dataFim).toLocaleDateString("pt-BR"),
                aluguel.quantidadeDias,
                `R$ ${item.precoUnitario}`,
                `R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`,
                valorTotal += item.quantidade * item.precoUnitario
            ]);

            autoTable(doc, {
                startY: 45, // Define onde começa a tabela
                head: [colunas],
                body: dados,
                theme: "grid",
                tableWidth: "auto",
                styles: { fontSize: 10, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 10, halign: "center" },  // Qtd.
                    1: { cellWidth: 35, halign: "left" },  // Descrição
                    2: { cellWidth: 25, halign: "left" },  // retirada
                    3: { cellWidth: 25, halign: "left" },  // entrega
                    4: { cellWidth: 15, halign: "left" },  // tot dias 
                    5: { cellWidth: 20, halign: "rigth" },  // Unit.
                    6: { cellWidth: 20, halign: "rigth" }   // Total
                }
            });

            // 📌 Total
            let finalY = doc.lastAutoTable.finalY + 5; // Posição após a tabela
            doc.text(`Total: R$ ${(valorTotal).toFixed(2)}`, 133, finalY);

            // 📌 Assinaturas
            doc.text("_____________________", 10, finalY + 15);
            doc.text("Ass. Comprador", 15, finalY + 20);

            doc.text("_____________________", 60, finalY + 15);
            doc.text("Assinatura Loja", 65, finalY + 20);

            // 📌 Observações
            doc.setFontSize(8);
            doc.text(
                "Nossos produtos e serviços têm garantia de __ meses.\nNossa garantia não cobre mau uso, quedas e desgastes naturais.",
                10,
                finalY + 30
            );



            const pdfBlob = doc.output("blob")
            const pdfUrl = URL.createObjectURL(pdfBlob)
            const newWindow = window.open(pdfUrl)

            if (newWindow) {
                newWindow.onload = () => newWindow.print();
            }


        } catch (err) {
            console.error("Erro ao imprimir PDF: ", err.message);
            alert("Erro ao imprimir PDF");
            return;
        }
    }


    return (

        <div className="container">
            <h2 className="titulo-tabela">Lista de Aluguéis</h2>
            <div className="tabela">
                {/* Cabeçalho único */}
                <div className="tabela-header">
                    <span>Cliente</span>
                    <span>Peça</span>
                    <span>Quantidade</span>
                    <span>Data Entrega</span>
                    <span>Data Saída</span>
                    <span>Ações</span>
                </div>

                {/* Corpo da tabela */}
                {alugueis.map(aluguel =>
                    aluguel.itens.map(item => (
                        <div key={item.id} className="tabela-linha">
                            <span className="cliente-nome">{aluguel.nomeCliente}</span>
                            <span className="peca">{item.peca}</span>
                            <span>{item.quantidade}</span>
                            <span>{formatData(aluguel.dataInicio.split('T')[0])}</span>
                            <span>{formatData(aluguel.dataFim.split('T')[0])}</span>
                            <div className="acoes">
                                <button className="btn btn-close" onClick={() => fecharStatus(aluguel.idAluguel)}>❌</button>
                                <button className="btn btn-print" onClick={() => imprimirPDF(aluguel)}>🖨️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>


    )


}

export default AlugueisClientePage;