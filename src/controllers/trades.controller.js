import * as tradeRepository from '../repositories/trades.repository.js';
import { logAction } from '../utils/logger.js';

export const createTrade = async (req, res) => {
    try {
        const newTrade = await tradeRepository.createTrade(req.body);
        await logAction('Trade', newTrade.Trade_ID, 'Create Trade', { trade: newTrade.Trade_Name });
        res.status(201).json(newTrade);
    } catch (error) {
        console.error('Error creating trade:', error);
        await logAction('Trade', null, 'Create Trade Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllTrades = async (req, res) => {
    try {
        const trades = await tradeRepository.getAllTrades();
        await logAction('Trade', null, 'Get All Trades', { count: trades.length });
        res.status(200).json(trades);
    } catch (error) {
        console.error('Error fetching trades:', error);
        await logAction('Trade', null, 'Get All Trades Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTradeById = async (req, res) => {
    try {
        const { id } = req.params;
        const trade = await tradeRepository.getTradeById(parseInt(id));
        if (!trade) {
            await logAction('Trade', id, 'Get Trade by ID', { status: 'Not found' });
            return res.status(404).json({ message: 'Trade not found' });
        }
        await logAction('Trade', id, 'Get Trade by ID', { trade: trade.Trade_Name });
        res.status(200).json(trade);
    } catch (error) {
        console.error('Error fetching trade by ID:', error);
        await logAction('Trade', req.params.id, 'Get Trade by ID Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTrade = await tradeRepository.updateTrade(parseInt(id), req.body);
        if (!updatedTrade) {
            await logAction('Trade', id, 'Update Trade', { status: 'Not found' });
            return res.status(404).json({ message: 'Trade not found' });
        }
        await logAction('Trade', id, 'Update Trade', { trade: updatedTrade.Trade_Name, updates: req.body });
        res.status(200).json(updatedTrade);
    } catch (error) {
        console.error('Error updating trade:', error);
        await logAction('Trade', req.params.id, 'Update Trade Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTrade = async (req, res) => {
    try {
        const { id } = req.params;
        await tradeRepository.deleteTrade(parseInt(id));
        await logAction('Trade', id, 'Delete Trade', { status: 'Success' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting trade:', error);
        await logAction('Trade', req.params.id, 'Delete Trade Error', { error: error.message });
        res.status(500).json({ message: 'Internal server error' });
    }
};
