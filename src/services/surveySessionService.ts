import SurveySession, { IResponse } from "../models/SurveySession";
import User from "../models/User";

export const createSession = async (userId: string) => {
  try {
    // Check for existing IN_PROGRESS session
    const existingSession = await SurveySession.findOne({
      user_id: userId,
      status: "IN_PROGRESS",
    });

    if (existingSession) {
      return {
        success: false,
        message: "User already has an active survey session",
      };
    }

    const session = await SurveySession.create({
      user_id: userId,
      status: "IN_PROGRESS",
      responses: [],
      current_question_index: 0,
    });

    // Update user's active session
    await User.findByIdAndUpdate(userId, {
      activeSurveySessionId: session._id,
    });

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in createSession:", error);
    return {
      success: false,
      message: "Error creating session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getSession = async (sessionId: string, userId: string) => {
  try {
    const session = await SurveySession.findOne({
      _id: sessionId,
      user_id: userId,
    });

    if (!session) {
      return {
        success: false,
        message: "Survey session not found",
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in getSession:", error);
    return {
      success: false,
      message: "Error retrieving session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getUserSessions = async (userId: string) => {
  try {
    const sessions = await SurveySession.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    return {
      success: true,
      data: sessions,
    };
  } catch (error) {
    console.error("Error in getUserSessions:", error);
    return {
      success: false,
      message: "Error retrieving user sessions",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateSession = async (
  sessionId: string,
  userId: string,
  updates: Partial<IResponse>
) => {
  try {
    const session = await SurveySession.findOneAndUpdate(
      {
        _id: sessionId,
        user_id: userId,
        status: "IN_PROGRESS",
      },
      { $set: updates },
      { new: true }
    );

    if (!session) {
      return {
        success: false,
        message: "Survey session not found or already completed",
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in updateSession:", error);
    return {
      success: false,
      message: "Error updating session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteSession = async (sessionId: string, userId: string) => {
  try {
    const session = await SurveySession.findOneAndDelete({
      _id: sessionId,
      user_id: userId,
    });

    if (!session) {
      return {
        success: false,
        message: "Survey session not found",
      };
    }

    // If this was the active session, clear it from user
    await User.findByIdAndUpdate(userId, {
      $unset: { activeSurveySessionId: "" },
    });

    return {
      success: true,
      message: "Survey session deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteSession:", error);
    return {
      success: false,
      message: "Error deleting session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const submitResponse = async (
  sessionId: string,
  userId: string,
  response: IResponse
) => {
  try {
    const session = await SurveySession.findOne({
      _id: sessionId,
      user_id: userId,
      status: "IN_PROGRESS",
    });

    if (!session) {
      return {
        success: false,
        message: "Active survey session not found",
      };
    }

    // Add response and increment question index
    session.responses.push(response);
    session.current_question_index += 1;

    await session.save();

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in submitResponse:", error);
    return {
      success: false,
      message: "Error submitting response",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
