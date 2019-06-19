import { Controller, Get, Req, Query, Headers, Param, Post, Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { DemoService } from './providers/demo/demo.service';
import { DemoFilter } from '../../core/filters/demo.filter';


@Controller('posts')
export class PostsController {
    constructor(private readonly demoService: DemoService) {
        this.demoService = demoService;
    }

    @Get()
    index() {
        return this.demoService.findAll();
    }

    @Get(':id')
    show(@Param() params) {
        return {
            title: `Post ${params.id}`
        }
    }

    @Post()
    @UseFilters(DemoFilter)
    store(@Body() post: CreatePostDto) {
        throw new HttpException('Permission Denied', HttpStatus.FORBIDDEN);
        //this.demoService.create(post);
    }
}
