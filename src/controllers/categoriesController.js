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
        res.status(422).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        // const category = await db.collection("Users").find({ email }).toArray();
    } catch (error) {
        res.status(500).send("erro ao procurar user na database");
        return;

    }

    connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.status(201).send("categoria criada com sucesso")

}