import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import {unlink, readdirSync} from "fs";
  import {randomInt} from "crypto";
  
  @Controller('photo')
  export class PhotosController {
  
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      if(!file){
        // upload failed
        throw new BadRequestException("Upload failed")
      }
      console.log("fuck");
      
      return {
        message: 'File uploaded successfully',
        url: file.filename + '?new='+(Math.floor(1 + Math.random()*(1000 - 1 + 1))).toString()
      };
    }
    //Math.floor(min + Math.random()*(max - min + 1))
    //randomInt(1,1000)
    @Post('/update')
    @UseInterceptors(FileInterceptor('file'))
     updateFile(@UploadedFile() file: Express.Multer.File) {
      const files = readdirSync('storage/');
      const uploadedFile_extension = file.filename.split('.')
      for(let i=0;i<files.length;i++){// to delete the old photo
        const file_extension = files[i].split('.')
        if(file_extension[0]===uploadedFile_extension[0] && file_extension[1]!==uploadedFile_extension[1]){
           unlink('storage/'+files[i], (err)=>{ // delete photo of the player
            if(err){
              console.log(err)
              throw new BadRequestException({message:"error in deleting th photo"})
            }
          })
          break
        }
      }
      if(!file){
        // upload failed
        throw new BadRequestException("Upload failed")
      }
      return {
        message: 'File uploaded successfully',
        url: file.filename + '?new='+(randomInt(1,1000)).toString()
      };
    }
  
    @Get('/test/')
    test() {
      return {message:`server is working`}
  
    }
  
    @Get('/:name')
    getFile(@Param('name') name: string, @Res() res: Response) {
      try{
        return res.sendFile(name, { root: 'storage' });
      }catch (err){
        throw new Error(err)
      }
  
    }
  
    @Delete('/delete/:name')
    deletePhoto(@Param('name') name:string) {
      unlink('storage/'+name, (err)=>{ // delete photo of that player
          if(err){
              console.log(err)
              throw new BadRequestException({message:"error in deleting th photo"})
          }
      })
      return {
        message: 'File deleted successfully',
      };
    }
  }