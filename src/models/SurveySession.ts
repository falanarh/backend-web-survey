// src/models/SurveySession.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IResponse {
  question_code: string;
  valid_response: string | number | string[];
}

export interface ISurveySession extends Document {
  user_id: mongoose.Types.ObjectId;
  status: 'IN_PROGRESS' | 'COMPLETED';
  responses: IResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const ResponseSchema = new Schema({
  question_code: String,
  valid_response: Schema.Types.Mixed,
});

const SurveySessionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED'],
      default: 'IN_PROGRESS',
    },
    responses: [ResponseSchema],
  },
  {
    timestamps: true,
  }
);

// Change the index to only consider user_id
SurveySessionSchema.index({ user_id: 1 }, { unique: true });

const SurveySession = mongoose.model<ISurveySession>('SurveySession', SurveySessionSchema, 'webSurveySessions');
export default SurveySession;