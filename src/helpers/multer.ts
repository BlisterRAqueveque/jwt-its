import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import fs = require('fs');

import path = require('path');

type validFileExtension =
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'pdf'
  | 'doc'
  | 'xls'
  | 'docx'
  | 'xlsx';
type validMimeType =
  | 'image/png'
  | 'image/jpg'
  | 'image/jpeg'
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/msword'
  | 'application/vnd.ms-excel'
  | 'image/gif';

const validFileExtension: validFileExtension[] = [
  'png',
  'jpg',
  'jpeg',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
];
const validMimeType: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
];

//! File extension supported:
export const imgStorage = (destination) => {
  return {
    storage: diskStorage({
      destination: `./uploads/${destination}`,
      filename: (req, file, callback) => {
        const fileExtension: string = path.extname(file.originalname);
        const filename: string = uuidv4() + fileExtension;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes: validMimeType[] = validMimeType;
      allowedMimeTypes.includes(file.mimetype)
        ? callback(null, true)
        : callback(null, false);
    },
  };
};

//! Update file function
export const removeFile = (fullFilePath: string) => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (e) {
    console.error(new Date(), e);
  }
};
