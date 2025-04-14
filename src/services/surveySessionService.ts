import SurveySession, { IResponse } from "../models/SurveySession";
import User from "../models/User";

export const createSession = async (userId: string) => {
  try {
    // Check for any existing session regardless of status
    const existingSession = await SurveySession.findOne({
      user_id: userId
    });

    if (existingSession) {
      return {
        success: false,
        message: "User already has a survey session. Please complete or delete the existing session first.",
        data: existingSession
      };
    }

    const session = await SurveySession.create({
      user_id: userId,
      status: "IN_PROGRESS",
      responses: []
    });

    // Update user's active session
    await User.findByIdAndUpdate(userId, {
      activeSurveySessionId: session._id
    });

    return {
      success: true,
      data: session
    };
  } catch (error) {
    console.error("Error in createSession:", error);
    return {
      success: false,
      message: "Error creating session",
      error: error instanceof Error ? error.message : "Unknown error"
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
      user_id: userId
    });

    if (!session) {
      return {
        success: false,
        message: "Survey session not found"
      };
    }

    // Always clear the activeSurveySessionId from user when deleting session
    await User.findByIdAndUpdate(userId, {
      $unset: { activeSurveySessionId: "" }
    });

    return {
      success: true,
      message: "Survey session deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteSession:", error);
    return {
      success: false,
      message: "Error deleting session",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

export const submitResponse = async (
  sessionId: string,
  userId: string,
  response: IResponse
) => {
  try {
    // Find the session
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

    // Check if a response with this question code already exists
    const existingResponseIndex = session.responses.findIndex(
      (r) => r.question_code === response.question_code
    );

    if (existingResponseIndex !== -1) {
      console.log("Updating existing response");
      // Update existing response
      session.responses[existingResponseIndex].valid_response = response.valid_response;
    } else {
      console.log("Adding new response");
      // Add new response
      session.responses.push({
        question_code: response.question_code,
        valid_response: response.valid_response
      });
    }

    // Sort responses by question_code in ascending order
    session.responses.sort((a, b) => 
      a.question_code.localeCompare(b.question_code)
    );

    // Save the updated session
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
