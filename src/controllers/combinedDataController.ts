import User from '../models/User';
import SurveySession from '../models/SurveySession';
import SurveyEvaluation from '../models/SurveyEvaluation';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// GET /api/combined-data/:userId
export const getCombinedData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    // Get user
    const user = await User.findById(userId).select('_id email name');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get survey session for user
    const surveySession = await SurveySession.findOne({ user_id: userId });
    // Get survey evaluation for user
    const surveyEvaluation = await SurveyEvaluation.findOne({ user_id: userId });

    // Flatten responses: { [question_code]: valid_response }
    let responsesObj: Record<string, any> = {};
    if (surveySession && Array.isArray(surveySession.responses)) {
      surveySession.responses.forEach((resp: any) => {
        if (resp && resp.question_code) {
          let value = resp.valid_response;
          if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
            value = value.join(',');
          }
          responsesObj[resp.question_code] = value;
        }
      });
    }

    const mergedData: any = {
      id: user._id,
      email: user.email,
      name: user.name,
      ...responsesObj,
      ...(surveySession && surveySession.metrics ? { ...surveySession.metrics } : {}),
      ...(surveySession && surveySession.time_consumed ? { ...surveySession.time_consumed } : {}),
      ...(surveyEvaluation && surveyEvaluation.answers ? { ...surveyEvaluation.answers } : {}),
    };

    res.json(mergedData);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

// GET /api/combined-data
export const getAllCombinedData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all users
    const users = await User.find().select('_id email name');
    const results = await Promise.all(users.map(async (user) => {
      // Get survey session for user
      const surveySession = await SurveySession.findOne({ user_id: user._id });
      // Get survey evaluation for user
      const surveyEvaluation = await SurveyEvaluation.findOne({ user_id: user._id });

      // Flatten responses: { [question_code]: valid_response }
      let responsesObj: Record<string, any> = {};
      if (surveySession && Array.isArray(surveySession.responses)) {
        surveySession.responses.forEach((resp: any) => {
          if (resp && resp.question_code) {
            let value = resp.valid_response;
            if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
              value = value.join(',');
            }
            responsesObj[resp.question_code] = value;
          }
        });
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        ...responsesObj,
        ...(surveySession && surveySession.metrics ? { ...surveySession.metrics } : {}),
        ...(surveySession && surveySession.time_consumed ? { ...surveySession.time_consumed } : {}),
        ...(surveyEvaluation && surveyEvaluation.answers ? { ...surveyEvaluation.answers } : {}),
      };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
}; 