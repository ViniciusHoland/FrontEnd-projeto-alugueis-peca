import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import api from '../../services/api'

function CadastroCliente() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: "",
        cpfCnpj: "",
        email: "",
        endereco: "",
        telefone: "",
    })


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{


            const token = localStorage.getItem('token');

            if(!token){
                alert("Token não encontrado");
                return;
            }

            const response = await api.post("/clientes/cadastro", {
                nome: formData.nome,
                cpfCnpj: formData.cpfCnpj,
                email: formData.email,
                endereco: formData.endereco,
                telefone: formData.telefone,
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
        )

        console.log(response)
        alert("Cliente cadastrado com sucesso!");
        navigate('/home')

        } catch (err){
            console.log(err);
            alert("Erro ao cadastrar o cliente");
        }
    }


    return (
        <Container className="mt-4">
        <h2 className="text-center">Cadastro de Cliente</h2>
        <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col md={6}>
                    <Form.Label>CPF/CNPJ</Form.Label>
                    <Form.Control
                        type="text"
                        name="cpfCnpj"
                        value={formData.cpfCnpj}
                        onChange={handleChange}
                        pattern="^\d{11}|\d{14}$"
                        title="Digite um CPF (11 dígitos) ou CNPJ (14 dígitos)"
                        required
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col md={6}>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100">
                Cadastrar Cliente
            </Button>
        </Form>
    </Container>
    )


}


export default CadastroCliente;