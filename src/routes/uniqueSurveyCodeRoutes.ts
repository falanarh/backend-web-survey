import { Router } from 'express';
import { addUniqueSurveyCode, addManyUniqueSurveyCodes, removeUniqueSurveyCode, checkUniqueSurveyCode } from '../controllers/uniqueSurveyCodeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/unique-code', addUniqueSurveyCode);
router.post('/unique-code/bulk', addManyUniqueSurveyCodes);
router.delete('/unique-code/:kode_unik', removeUniqueSurveyCode);
router.get('/unique-code/:kode_unik', checkUniqueSurveyCode);

export default router; 