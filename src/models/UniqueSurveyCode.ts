import mongoose, { Schema, Document } from 'mongoose';

export interface IUniqueSurveyCode extends Document {
  nama_responden: string;
  kode_unik: string;
}

const UniqueSurveyCodeSchema: Schema = new Schema({
  nama_responden: { type: String, required: true },
  kode_unik: { type: String, required: true, unique: true },
});

const UniqueSurveyCode = mongoose.model<IUniqueSurveyCode>('UniqueSurveyCode', UniqueSurveyCodeSchema);
export default UniqueSurveyCode; 