import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import {CoachesService} from 'src/coaches/service/coaches.service'
import { CreateCoachRequest } from '../requests/createCoachRequest';
import { UpdateCoachRequest } from '../requests/updateCoachRequest';

@Controller('coaches')
@UseGuards(JwtAuthGuard)
export class CoachesController {
    
    constructor(
        private readonly CoachService : CoachesService
    ){}

    @Get("/")
    getAll(){
        return this.CoachService.getAll();
    }

    @Get('/:id')
    getById(@Param() param) {
        return this.CoachService.findById(param.id);
    }

    @Post("/")
    create(@Body() body: CreateCoachRequest){
        return this.CoachService.create(body);
    }

    @Patch("/:id")
    update(@Body() body: UpdateCoachRequest, @Param() params){
        return this.CoachService.update(body, params.id);
    }

    @Delete("/:id")
    delete(@Param() params){
        return this.CoachService.delete(params.id);
    }
}
