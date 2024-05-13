import { Module} from "@nestjs/common";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {PhotosController} from "./controllers/photos.controller";

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null,'./storage')
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1];
    cb(null, req.query.phone + `.${extension}`)
  }
})

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
      fileFilter: function (req, file, callback) {
        const extension = file.mimetype.split('/')[1];
        const valid_ext = ['jpg','jpeg','png','bmp']
        if (valid_ext.indexOf(extension) == -1) {
          callback(new Error('Invalid File extension'),false)
        }
        callback(null,true);
      }
    })
  ],
  controllers: [PhotosController],
  providers: [],
  exports: []
})
export class PhotosModule {}