// src/models/SurveySession.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IResponse {
  question_code: string;
  valid_response: string | number | string[];
  response_time?: number; // waktu dalam ms
}

export interface IResponseMetrics {
  is_breakoff: boolean;
  avg_response_time: number;
  item_nonresponse: number;
  dont_know_response: number;
}

export interface ISurveySession extends Document {
  user_id: mongoose.Types.ObjectId;
  status: 'IN_PROGRESS' | 'COMPLETED';
  responses: IResponse[];
  metrics?: IResponseMetrics;
  createdAt: Date;
  updatedAt: Date;
}

const ResponseSchema = new Schema({
  question_code: String,
  valid_response: Schema.Types.Mixed,
  response_time: Number, // waktu dalam ms
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
    metrics: {
      is_breakoff: { type: Boolean, default: false },
      avg_response_time: { type: Number, default: 0 },
      item_nonresponse: { type: Number, default: 0 },
      dont_know_response: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

// Change the index to only consider user_id
SurveySessionSchema.index({ user_id: 1 }, { unique: true });

const SurveySession = mongoose.model<ISurveySession>('SurveySession', SurveySessionSchema, 'webSurveySessions');

export default SurveySession;