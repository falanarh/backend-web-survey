import SurveySession, { IResponse } from "../models/SurveySession";
import User from "../models/User";

const QUESTION_CODES = [
  "KR001",
  "KR002",
  "KR003",
  "KR004",
  "KR005",
  "KR006",
  // "S001",
  "S002",
  "S003",
  "S004",
  "S005",
  "S006",
  "S007",
  "S008",
  "S009",
  "S010",
  "S011",
  "S012",
  "S013",
  "S014",
  "S015",
  "S016",
  "S017",
  "S018",
  "S019",
  "S020",
  "S021",
  "S022",
  "S023",
  "S024",
  "S025",
  "S026",
  "S027",
  "S028",
  "S029",
  "UCODE",
];

export const createSession = async (userId: string) => {
  try {
    // Check for any existing session regardless of status
    const existingSession = await SurveySession.findOne({
      user_id: userId,
    });

    if (existingSession) {
      return {
        success: false,
        message:
          "User already has a survey session. Please complete or delete the existing session first.",
        data: existingSession,
      };
    }

    // Inisialisasi responses dengan initial value ""
    const initialResponses = QUESTION_CODES.map((code) => ({
      question_code: code,
      valid_response: "",
    }));

    const session = await SurveySession.create({
      user_id: userId,
      status: "IN_PROGRESS",
      responses: initialResponses,
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

    // Always clear the activeSurveySessionId from user when deleting session
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
  response: IResponse & { response_time?: number }
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
      // Update existing response
      session.responses[existingResponseIndex].valid_response =
        response.valid_response;
      session.responses[existingResponseIndex].response_time =
        response.response_time ?? session.responses[existingResponseIndex].response_time;
    } else {
      // Add new response
      session.responses.push({
        question_code: response.question_code,
        valid_response: response.valid_response,
        response_time: response.response_time ?? 0,
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

export const completeSession = async (sessionId: string, userId: string) => {
  try {
    const session = await SurveySession.findOne({
      _id: sessionId,
      user_id: userId,
      status: "IN_PROGRESS",
    });

    if (!session) {
      return {
        success: false,
        message: "Survey session not found or already completed",
      };
    }

    const totalQuestions = session.responses.length;
    const item_nonresponse = session.responses.filter(
      r => r.valid_response === "" || r.valid_response === null || r.valid_response === undefined
    ).length;
    const dont_know_response = session.responses.filter(
      r => typeof r.valid_response === "string" && r.valid_response.toLowerCase() === "tidak tahu"
    ).length;
    const response_times = session.responses
      .map(r => typeof r.response_time === "number" ? r.response_time : 0)
      .filter(rt => rt > 0);
    const avg_response_time = response_times.length > 0
      ? response_times.reduce((a, b) => a + b, 0) / response_times.length
      : 0;

    // is_breakoff: false karena user menyelesaikan survei
    const is_breakoff = false;

    session.status = "COMPLETED";
    session.metrics = {
      is_breakoff,
      avg_response_time,
      item_nonresponse,
      dont_know_response
    };

    await session.save();

    await User.findByIdAndUpdate(userId, {
      $unset: { activeSurveySessionId: "" },
    });

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in completeSession:", error);
    return {
      success: false,
      message: "Error completing session",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateTimeConsumed = async (
  sessionId: string,
  userId: string,
  karakteristik: number,
  survei: number
) => {
  try {
    const session = await SurveySession.findOne({ _id: sessionId, user_id: userId });
    if (!session) {
      return { success: false, message: 'Survey session not found' };
    }

    // Hitung jumlah pertanyaan per tab berdasarkan kode pertanyaan
    const karakteristikQuestions = session.responses.filter(r => r.question_code.startsWith('KR')).length;
    console.log("karakteristikQuestions", karakteristikQuestions);
    const surveiQuestions = session.responses.filter(r => r.question_code.startsWith('S')).length;
    console.log("surveiQuestions", surveiQuestions);

    // Hitung avg_response_time per tab
    const avg_response_time_karakteristik = karakteristikQuestions > 0 ? parseFloat((karakteristik / karakteristikQuestions).toFixed(2)) : 0;
    const avg_response_time_survei = surveiQuestions > 0 ? parseFloat((survei / surveiQuestions).toFixed(2)) : 0;

    // Update session dengan time_consumed dan avg_response_time
    const updatedSession = await SurveySession.findOneAndUpdate(
      { _id: sessionId, user_id: userId },
      {
        $set: {
          'time_consumed.karakteristik': karakteristik,
          'time_consumed.survei': survei,
          'metrics.avg_response_time': avg_response_time_survei // Gunakan avg dari tab survei sebagai default
        }
      },
      { new: true }
    );

    if (!updatedSession) {
      return { success: false, message: 'Failed to update session' };
    }

    return { 
      success: true, 
      data: {
        time_consumed: updatedSession.time_consumed,
        avg_response_time: updatedSession.metrics?.avg_response_time || 0,
        karakteristik_questions: karakteristikQuestions,
        survei_questions: surveiQuestions,
        avg_response_time_karakteristik,
        avg_response_time_survei
      }
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};
