import { Request, Response } from "express";
import * as surveySessionService from "../services/surveySessionService";

export const createSurveySession = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const result = await surveySessionService.createSession(userId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating survey session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSurveySession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await surveySessionService.getSession(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving survey session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const result = await surveySessionService.getUserSessions(userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user sessions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateSurveySession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const result = await surveySessionService.updateSession(
      id,
      userId,
      updates
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating survey session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteSurveySession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await surveySessionService.deleteSession(id, userId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting survey session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { question_code, valid_response } = req.body;

    const result = await surveySessionService.submitResponse(id, userId, {
      question_code,
      valid_response,
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting response",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
