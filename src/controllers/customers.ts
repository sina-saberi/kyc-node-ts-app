import { Router } from 'express';
import Customer, { customerSchema, customerUpdateSchema } from '../models/customers';
import { validateBody } from '../middleware/validateBody';
import { Pagination } from '../models/pagination';
const router = Router();

const customers: Customer[] = []

// GET /customers
router.get('/', (req, res) => {
    const pagination = new Pagination(req);
    return pagination.getResponse(customers, res);
});

// GET /customers/id
router.get('/:id', (req, res) => {
    const customer = customers.find(x => x.id === req.params.id);

    if (!customer) {
        return res.status(404).json({ message: 'customer-not-found' });
    }

    const now = new Date();
    const isLocked = customer.pendingUntil && customer.pendingUntil > now;

    res.json({
        ...customer,
        state: isLocked ? 'locked' : 'unlocked'
    });
});

// POST /customers
router.post('/', validateBody(customerSchema), (req, res) => {
    const customer = Customer.create(req.body);
    customers.push(customer);
    res.json({ message: 'customer-created', customer });
});

// PUT /customers
router.put('/', validateBody(customerUpdateSchema), (req, res) => {
    const customer = Customer.create(req.body);
    const existing = customers.find(x => x.id === customer.id);

    if (!existing) {
        return res.status(404).json({ message: 'customer-not-found' });
    }

    const now = new Date();
    if (existing.pendingUntil && existing.pendingUntil > now) {
        return res.status(423).json({
            message: 'customer-locked',
            lockedUntil: existing.pendingUntil
        });
    }

    existing.update(customer);

    res.json({ message: 'customer-updated', customer });
});


export default router;