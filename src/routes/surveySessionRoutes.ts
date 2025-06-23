import { Router } from 'express';
import {
  createSurveySession,
  getSurveySession,
  getAllUserSessions,
  updateSurveySession,
  deleteSurveySession,
  submitResponse,
  completeSurveySession
} from '../controllers/surveySessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // All routes require authentication

router.post('/', createSurveySession);
router.get('/all-sessions', getAllUserSessions);
router.get('/:id', getSurveySession);
router.put('/:id', updateSurveySession);
router.delete('/:id', deleteSurveySession);
router.post('/:id/submit-response', submitResponse);
router.post('/:id/complete', completeSurveySession);

export default router;