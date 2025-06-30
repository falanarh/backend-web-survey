import SurveyEvaluation from '../models/SurveyEvaluation';
import SurveySession from '../models/SurveySession';
import User from '../models/User';

export const createEvaluation = async (userId: string, sessionId?: string) => {
  try {
    // If sessionId is provided, check for existing evaluation
    if (sessionId) {
      const existingEvaluation = await SurveyEvaluation.findOne({
        session_id: sessionId
      });

      if (existingEvaluation) {
        return {
          success: false,
          message: "This survey session already has an evaluation",
          data: existingEvaluation
        };
      }

      // Verify the session exists and belongs to user
      const session = await SurveySession.findOne({
        _id: sessionId,
        user_id: userId
      });

      if (!session) {
        return {
          success: false,
          message: "Survey session not found"
        };
      }
    }

    const evaluation = await SurveyEvaluation.create({
      user_id: userId,
      session_id: sessionId,
      answers: {},
      completed: false
    });

    // Update user's active evaluation session
    await User.findByIdAndUpdate(userId, {
      activeEvaluationSessionId: evaluation._id
    });

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error('Error in createEvaluation:', error);
    return {
      success: false,
      message: 'Error creating evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getEvaluation = async (evaluationId: string, userId: string) => {
  try {
    const evaluation = await SurveyEvaluation.findOne({
      _id: evaluationId,
      user_id: userId
    });

    if (!evaluation) {
      return {
        success: false,
        message: 'Evaluation not found'
      };
    }

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error('Error in getEvaluation:', error);
    return {
      success: false,
      message: 'Error retrieving evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getEvaluationBySessionId = async (sessionId: string, userId: string) => {
  try {
    // Find evaluation and verify ownership
    const evaluation = await SurveyEvaluation.findOne({
      session_id: sessionId,
      user_id: userId
    });

    if (!evaluation) {
      return {
        success: false,
        message: 'Survey evaluation not found for this session'
      };
    }

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error('Error in getEvaluationBySessionId:', error);
    return {
      success: false,
      message: 'Error retrieving evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getUserEvaluations = async (userId: string) => {
  try {
    const evaluations = await SurveyEvaluation.find({ user_id: userId })
      .sort({ created_at: -1 });

    return {
      success: true,
      data: evaluations
    };
  } catch (error) {
    console.error('Error in getUserEvaluations:', error);
    return {
      success: false,
      message: 'Error retrieving evaluations',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const updateEvaluation = async (
  evaluationId: string,
  userId: string,
  updates: Partial<{ answers: any; completed: boolean }>
) => {
  try {
    const evaluation = await SurveyEvaluation.findOneAndUpdate(
      {
        _id: evaluationId,
        user_id: userId,
        completed: false
      },
      { $set: updates },
      { new: true }
    );

    if (!evaluation) {
      return {
        success: false,
        message: 'Evaluation not found or already completed'
      };
    }

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error('Error in updateEvaluation:', error);
    return {
      success: false,
      message: 'Error updating evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const deleteEvaluation = async (evaluationId: string, userId: string) => {
  try {
    const evaluation = await SurveyEvaluation.findOneAndDelete({
      _id: evaluationId,
      user_id: userId
    });

    if (!evaluation) {
      return {
        success: false,
        message: 'Evaluation not found'
      };
    }

    // If this was the active evaluation, clear it from user
    await User.findByIdAndUpdate(userId, {
      $unset: { activeEvaluationSessionId: "" }
    });

    return {
      success: true,
      message: 'Evaluation deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteEvaluation:', error);
    return {
      success: false,
      message: 'Error deleting evaluation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const submitAnswer = async (
  evaluationId: string,
  userId: string,
  answers: any
) => {
  try {
    // Validate answer values
    for (const [key, value] of Object.entries(answers)) {
      if (key === 'overall_experience') {
        if (typeof value !== 'string' || value.length > 1000) {
          return {
            success: false,
            message: `Invalid value for ${key}`
          };
        }
      } else if (key === 'mental_effort') {
        if (typeof value !== 'number' || value < 1 || value > 9) {
          return {
            success: false,
            message: `Invalid value for ${key}`
          };
        }
      } else {
        if (typeof value !== 'number' || value < 1 || value > 7) {
          return {
            success: false,
            message: `Invalid value for ${key}`
          };
        }
      }
    }

    const evaluation = await SurveyEvaluation.findOneAndUpdate(
      {
        _id: evaluationId,
        user_id: userId,
        completed: false
      },
      {
        $set: {
          answers: { ...answers },
          completed: Object.keys(answers).length >= 7 // Mark as completed if all answers are provided
        }
      },
      { new: true }
    );

    if (!evaluation) {
      return {
        success: false,
        message: 'Evaluation not found or already completed'
      };
    }

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    return {
      success: false,
      message: 'Error submitting answer',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const submitEvaluationAnswer = async (
  evaluationId: string, 
  userId: string,
  answer: {
    criteriaName: string;
    value: number | string;
  }
) => {
  try {
    const evaluation = await SurveyEvaluation.findOne({
      _id: evaluationId,
      user_id: userId,
      completed: false
    });

    if (!evaluation) {
      return {
        success: false,
        message: "Evaluation not found or already completed"
      };
    }

    // Validate answer value based on criteria
    const isValid = validateCriteriaValue(answer.criteriaName, answer.value);
    if (!isValid) {
      return {
        success: false,
        message: `Invalid value for ${answer.criteriaName}`
      };
    }

    // Update single answer
    evaluation.answers = {
      ...evaluation.answers,
      [answer.criteriaName]: answer.value
    };

    // Check if all criteria are answered
    const requiredCriteria = [
      'ease_of_use',
      'participation_ease',
      'enjoyment',
      'data_security',
      'privacy_safety',
      'mental_effort',
      'overall_experience'
    ];

    const isComplete = requiredCriteria.every(criteria => 
      evaluation.answers[criteria] !== undefined
    );

    if (isComplete) {
      evaluation.completed = true;
    }

    await evaluation.save();

    return {
      success: true,
      data: evaluation
    };
  } catch (error) {
    console.error("Error in submitEvaluationAnswer:", error);
    return {
      success: false,
      message: "Error submitting answer",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Helper function to validate criteria values
const validateCriteriaValue = (criteria: string, value: number | string): boolean => {
  switch (criteria) {
    case 'mental_effort':
      return typeof value === 'number' && value >= 1 && value <= 9;
    case 'overall_experience':
      return typeof value === 'string' && value.length <= 1000;
    default:
      return typeof value === 'number' && value >= 1 && value <= 7;
  }
};