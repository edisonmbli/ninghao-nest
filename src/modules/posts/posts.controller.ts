import { Controller, Get, Req, Query, Headers, Param, Post, Body, HttpException, HttpStatus, UseFilters, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, SetMetadata } from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { DemoService } from './providers/demo/demo.service';
import { DemoFilter } from '../../core/filters/demo.filter';
import { DemoAuthGuard } from '../../core/guards/demo-auth.guard';
import { Roles } from '../../core/decorators/roles.decorator';


@Controller('posts')
//@UseGuards(DemoAuthGuard)
export class PostsController {
    constructor(private readonly demoService: DemoService) {
        this.demoService = demoService;
    }

    @Get()
    index() {
        return this.demoService.findAll();
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
    store(@Body() post: CreatePostDto) {
        //throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN);
        this.demoService.create(post);
    }
}
