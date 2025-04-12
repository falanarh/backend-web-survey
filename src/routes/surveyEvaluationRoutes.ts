import { Router } from 'express';
import {
  createEvaluation,
  getEvaluation,
  getAllUserEvaluations,
  updateEvaluation,
  deleteEvaluation,
  submitEvaluationAnswer
} from '../controllers/surveyEvaluationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // All routes require authentication

router.post('/', createEvaluation);
router.get('/all-evaluations', getAllUserEvaluations);
router.get('/:id', getEvaluation);
router.put('/:id', updateEvaluation);
router.delete('/:id', deleteEvaluation);
router.post('/:id/submit-answer', submitEvaluationAnswer);

export default router;