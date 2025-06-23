import UniqueSurveyCode, { IUniqueSurveyCode } from '../models/UniqueSurveyCode';

export const createUniqueSurveyCode = async (nama_responden: string, kode_unik: string): Promise<IUniqueSurveyCode> => {
  const newCode = new UniqueSurveyCode({ nama_responden, kode_unik });
  return await newCode.save();
};

export const createManyUniqueSurveyCodes = async (data: { nama_responden: string; kode_unik: string }[]): Promise<IUniqueSurveyCode[]> => {
  return await UniqueSurveyCode.insertMany(data, { ordered: false });
};

export const deleteUniqueSurveyCode = async (kode_unik: string): Promise<IUniqueSurveyCode | null> => {
  return await UniqueSurveyCode.findOneAndDelete({ kode_unik });
};

export const validateUniqueSurveyCode = async (kode_unik: string): Promise<IUniqueSurveyCode | null> => {
  return await UniqueSurveyCode.findOne({ kode_unik });
}; 