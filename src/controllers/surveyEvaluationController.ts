import { Request, Response } from 'express';
import * as surveyEvaluationService from '../services/surveyEvaluationService';

export const createEvaluation = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { session_id } = req.body;
    
    const result = await surveyEvaluationService.createEvaluation(userId, session_id);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const result = await surveyEvaluationService.getEvaluation(id, userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllUserEvaluations = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const result = await surveyEvaluationService.getUserEvaluations(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving evaluations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;
    
    const result = await surveyEvaluationService.updateEvaluation(id, userId, updates);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const result = await surveyEvaluationService.deleteEvaluation(id, userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const submitEvaluationAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { answers } = req.body;
    
    const result = await surveyEvaluationService.submitAnswer(id, userId, answers);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting evaluation answer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};