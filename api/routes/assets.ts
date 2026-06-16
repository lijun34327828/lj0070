import { Router } from 'express';
import {
  assetOverview,
  assetCategories,
  assetTrend12m,
  investmentIncome,
  assetAllocation,
  monthlyIncomeData,
  holdingPeriodData,
  riskReturnData
} from '../data/mockData.js';

const router = Router();

router.get('/overview', (_req, res) => {
  res.json(assetOverview);
});

router.get('/categories', (_req, res) => {
  res.json(assetCategories);
});

router.get('/trend', (req, res) => {
  const period = req.query.period as string || '12m';
  let data = assetTrend12m;
  
  if (period === '6m') {
    data = assetTrend12m.slice(-6);
  } else if (period === '3m') {
    data = assetTrend12m.slice(-3);
  }
  
  res.json(data);
});

router.get('/income', (_req, res) => {
  res.json(investmentIncome);
});

router.get('/allocation', (_req, res) => {
  res.json(assetAllocation);
});

router.get('/monthly-income', (_req, res) => {
  res.json(monthlyIncomeData);
});

router.get('/holding-period', (_req, res) => {
  res.json(holdingPeriodData);
});

router.get('/risk-return', (_req, res) => {
  res.json(riskReturnData);
});

export default router;
