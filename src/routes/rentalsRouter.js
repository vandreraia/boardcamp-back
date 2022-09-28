import { getRentals, postRentals } from "../controllers/rentalsController.js"
import { Router } from "express";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', postRentals);

export default router;