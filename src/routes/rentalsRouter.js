import { getRentals, postRentals } from "../controllers/rentalsController.js"
import { Router } from "express";

const router = Router();

router.get('/rentals', getrentals);
router.post('/rentals', postrentals);

export default router;