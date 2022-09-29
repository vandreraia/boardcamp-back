import { deleteRentals, finalizeRentals, getRentals, postRentals } from "../controllers/rentalsController.js"
import { Router } from "express";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', postRentals);
router.post('/rentals/:id/return', finalizeRentals);
router.delete('/rentals/:id', deleteRentals);

export default router;