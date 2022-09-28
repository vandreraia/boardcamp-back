import joi from "joi";
import connection from "../db/postgres.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;


    try {
        if (cpf) {
            cpf += "%";
            const { rows: customers } = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1', [cpf]);
            res.status(200).send(customers);
        } else {
            const { rows: customers } = await connection.query('SELECT * FROM customers');
            res.status(200).send(customers);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomersById(req, res) {

    const { id } = req.params;

    try {
        const { rows: customers } = await connection.query('SELECT * FROM customers where id = $1', [id]);
        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    const customersSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().min(11).max(11).required(),
        birthday: joi.date().required()
    })

    const validate = customersSchema.validate(req.body);
    if (validate.error) {
        const { rows: searchCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (searchCpf.length > 0) {
            return res.status(409).send("cpf duplicado");
        }
        console.log(validate.error.details);
        res.status(422).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        await connection.query('UPDATE customer SET name = $1, phone = $2, cpf = $3, birthday = $4,  WHERE id = $5', [name, phone, cpf, birthday, id]);
        res.status(200).send("customer atualizado com sucesso");
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const customersSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().min(11).max(11).required(),
        birthday: joi.date().required()
    })

    const validate = customersSchema.validate(req.body);
    if (validate.error) {
        console.log(validate.error.details);
        res.status(400).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        const { rows: searchCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (searchCpf.length > 0) {
            return res.status(409).send("cpf duplicado");
        }
    } catch (error) {
        res.status(500).send("erro ao procurar user na database");
        return;

    }

    connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
    res.status(201).send("user criado com sucesso")

}