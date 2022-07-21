import { getCustomers, postCustomers, getCustomersById, updateCustomer } from "../controllers/customersController.js"
import { Router } from "express";

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomersById);
router.put('/customers/:id', updateCustomer);
router.post('/customers', postCustomers);

export default router;