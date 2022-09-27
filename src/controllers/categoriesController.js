import joi from "joi";
import connection from "../db/postgres.js";

export async function getCategories(req, res) {

    try {
        const { rows: categories } = await connection.query('SELECT * FROM categories');
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCategories(req, res) {
    const { name } = req.body;

    const categoriesSchema = joi.object({
        name: joi.string().required()
    })

    const validate = categoriesSchema.validate(req.body);
    if (validate.error) {
        console.log(validate.error.details);
        res.status(400).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        const { rows: categories } = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        if (categories > 0) {
            return res.status(409).send("categoria ja existe")
        }        
        connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.status(201).send("categoria criada com sucesso")
    } catch (error) {
        res.status(500).send(error.message);
        return;

    }


}