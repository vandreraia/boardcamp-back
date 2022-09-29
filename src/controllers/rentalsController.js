import joi from "joi";
import connection from "../db/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    let { customerId, gameId } = req.query;

    try {
        let rentals;
        if (customerId) {
            const { rows } = await connection.query('SELECT * FROM rentals WHERE "customerId" = $1', [customerId]);
            rentals = rows;
        } else if (gameId) {
            const { rows } = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
            rentals = rows;
        } else {
            const { rows } = await connection.query('SELECT * FROM rentals');
            rentals = rows;
        }

        let destruct = [];
        for (let i = 0; i < rentals.length; i++) {
            let { rows: customer } = await connection.query('SELECT id, name FROM customers WHERE id = $1', [rentals[i]["customerId"]]);
            let { rows: game } = await connection.query('SELECT id, name, "categoryId" FROM games WHERE id = $1', [rentals[i]["gameId"]]);
            game = game[0];
            customer = customer[0]
            destruct.push({ ...rentals[i], customer, game })
        }
        res.status(200).send(destruct);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postRentals(req, res) {
    const now = dayjs().format("YYYY-MM-DD");
    const { customerId, gameId, daysRented } = req.body;

    const rentalsSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required(),
    })

    const validate = rentalsSchema.validate(req.body);
    if (validate.error) {
        console.log(validate.error.details);
        res.status(400).send("Favor preecher os campos corretamente");
        return;
    }

    try {
        const { rowCount: existUser } = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);
        const { rowCount: existGame } = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);
        const { rows: gameInfo } = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);
        const { rowCount: numberRentals } = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
        console.log(numberRentals);
        if (existUser === 0 || existGame === 0 || numberRentals > gameInfo[0]['stockTotal']) {
            return res.status(400).send("customer ou jogo nao exite ou nao tem mais estoque")
        }

        const originalPrice = gameInfo[0]['pricePerDay'] * daysRented;
        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)', [customerId, gameId, now, daysRented, originalPrice]);
        res.status(201).send("categoria criada com sucesso")
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}