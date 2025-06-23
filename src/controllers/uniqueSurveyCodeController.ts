import { Request, Response } from 'express';
import { createUniqueSurveyCode, createManyUniqueSurveyCodes, deleteUniqueSurveyCode, validateUniqueSurveyCode } from '../services/uniqueSurveyCodeService';

export const addUniqueSurveyCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_responden, kode_unik } = req.body;
    const code = await createUniqueSurveyCode(nama_responden, kode_unik);
    res.status(201).json({ success: true, data: code });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addManyUniqueSurveyCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body; // array of { nama_responden, kode_unik }
    if (!Array.isArray(data)) {
      res.status(400).json({ success: false, message: 'Input harus berupa array' });
      return;
    }
    const codes = await createManyUniqueSurveyCodes(data);
    res.status(201).json({ success: true, data: codes });
  } catch (error: any) {
    // Tangani duplicate key error
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Beberapa kode_unik sudah ada di database', error: error.writeErrors });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export const removeUniqueSurveyCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kode_unik } = req.params;
    const deleted = await deleteUniqueSurveyCode(kode_unik);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Kode unik tidak ditemukan' });
      return;
    }
    res.json({ success: true, data: deleted });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkUniqueSurveyCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kode_unik } = req.params;
    const found = await validateUniqueSurveyCode(kode_unik);
    if (!found) {
      res.status(404).json({ success: false, message: 'Kode unik tidak valid' });
      return;
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}; 