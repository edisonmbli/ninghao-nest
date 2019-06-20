import { Controller, Get, Req, Query, Headers, Param, Post, Body, HttpException, HttpStatus, UseFilters, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, SetMetadata, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { DemoService } from './providers/demo/demo.service';
import { DemoFilter } from '../../core/filters/demo.filter';
import { DemoAuthGuard } from '../../core/guards/demo-auth.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { LoggingInterceptor } from '../../core/interceptors/logging.interceptor';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { ErrorsInterceptor } from '../../../dist/core/interceptors/errors.interceptor';
import { User } from '../../core/decorators/user.decorator';


@Controller('posts')
//@UseGuards(DemoAuthGuard)
//@UseInterceptors(LoggingInterceptor)
export class PostsController {
    constructor(private readonly demoService: DemoService) {
        this.demoService = demoService;
    }

    @Get()
    //@UseInterceptors(TransformInterceptor)
    @UseInterceptors(ErrorsInterceptor)
    index() {
        throw new ForbiddenException();
        //return this.demoService.findAll();
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id) {
        console.log('id:', typeof id);

        return {
            title: `Post ${id}`
        }
    }

    @Post()
    //@UseFilters(DemoFilter)
    @UsePipes(ValidationPipe)
    //@SetMetadata('roles', ['member'])
    @Roles('member')
    store(@Body() post: CreatePostDto, @User() user) {
        //throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN);
        console.log(user);
        this.demoService.create(post);
    }
}
