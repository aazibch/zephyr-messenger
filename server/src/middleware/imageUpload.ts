import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import catchAsync from './catchAsync';
import AppError from '../utils/AppError';
import { AuthenticatedRequest, AuthenticatedRequestWithFile } from '../types';

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  next: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    return next(null, true);
  }

  next(new AppError('Not an image. Only image formats are accepted.', 400));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

export const uploadAttachedImage = upload.single('image');

export const uploadProfileImage = upload.single('profileImage');

export const editImage = (type: string) => {
  return catchAsync(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.file) return next();

      req.file.filename = `user-${req.user._id}-${Date.now()}`;

      let buffer;

      if (type === 'attachedImage') {
        buffer = await sharp(req.file.buffer)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer();
      } else if (type === 'profileImage') {
        buffer = await sharp(req.file.buffer)
          .resize(300, 300)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      req.file.buffer = buffer;

      next();
    }
  );
};

// export const editAttachedImage = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!req.file) return next();

//     req.file.filename = `user-${req.user._id}-${Date.now()}`;

//     const buffer = await sharp(req.file.buffer)
//       .toFormat('jpeg')
//       .jpeg({ quality: 90 })
//       .toBuffer();

//       // .resize(750, null, {
//       //   withoutEnlargement: true
//       // })
//     req.file.buffer = buffer;

//     next();
//   }
// );

export const saveImageToCloud = (type: string) => {
  return catchAsync(
    async (
      req: AuthenticatedRequestWithFile,
      res: Response,
      next: NextFunction
    ) => {
      if (!req.file) return next();

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      const base64 = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      let folder;

      if (type === 'attachedImage') {
        folder = 'zephyr-messenger/message-attachments';
      } else if (type === 'profileImage') {
        folder = 'zephyr-messenger/profile-images';
      }

      const savedImage = await cloudinary.uploader.upload(dataUri, {
        folder,
        public_id: req.file.filename
      });

      req.file.image = {
        url: savedImage.secure_url,
        width: savedImage.width,
        height: savedImage.height
      };

      next();
    }
  );
};

// export const saveAttachedImageToCloud = catchAsync(
//   async (
//     req: AuthenticatedRequestWithFile,
//     res: Response,
//     next: NextFunction
//   ) => {
//     if (!req.file) return next();

//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     });

//     const base64 = Buffer.from(req.file.buffer).toString('base64');
//     const dataUri = `data:${req.file.mimetype};base64,${base64}`;

//     const savedImage = await cloudinary.uploader.upload(dataUri, {
//       folder: 'zephyr-messenger/message-attachments',
//       public_id: req.file.filename
//     });

//     req.file.image = {
//       url: savedImage.secure_url,
//       width: savedImage.width,
//       height: savedImage.height
//     };

//     next();
//   }
// );
