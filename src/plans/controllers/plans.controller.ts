import {Controller, Get, Param} from '@nestjs/common';

@Controller('plans')
export class PlansController {

    @Get()
    getPlans() {
        return ['123','456'];
    }

    @Get(':id')
    getPlanInfo(@Param() params) {
        return {
            id: params.id
        }
    }

}
