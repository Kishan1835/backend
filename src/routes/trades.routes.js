import express from 'express';
const router = express.Router();
import { createTrade, getAllTrades, getTradeById, updateTrade, deleteTrade } from '../controllers/trades.controller.js';

router.post('/', createTrade);
router.get('/', getAllTrades);
router.get('/:id', getTradeById);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

export default router;
