import joi from "joi";
import connection from "../db/postgres.js";

export async function getGames(req, res) {
    let { name } = req.query;

    name = name.toLowerCase();
    name += "%";
    console.log(name)
    try {

        if (name) {
            const { rows: games } = await connection.query('SELECT * FROM games WHERE LOWER(name) LIKE $1', [name]);
            res.status(200).send(games);
        } else {
            const { rows: games } = await connection.query('SELECT * FROM games');
            res.status(200).send(games);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const gamesSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().required(),
        stockTotal: joi.number().required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().required()
    })

    const validate = gamesSchema.validate(req.body);
    if (validate.error) {
        console.log(validate.error.details);
        res.status(422).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        connection.query('INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        res.status(201).send("jogo criado com sucesso")
    } catch (error) {
        res.status(500).send(error.message);
        return;

    }


}