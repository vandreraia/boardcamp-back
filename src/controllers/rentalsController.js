import joi from "joi";
import connection from "../db/postgres.js";

export async function getRentals(req, res) {

    try {
        const { rows: rentals } = await connection.query('SELECT * FROM rentals');
        res.status(200).send(rentals);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rentalsSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().required(),
    })

    const validate = rentalsSchema.validate(req.body);
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

    connection.query('INSERT INTO rentals ("customerId", "gameId", "daysRented") VALUES ($1, $2, $3)', [customerId, gameId, daysRented]);
    res.status(201).send("categoria criada com sucesso")

}