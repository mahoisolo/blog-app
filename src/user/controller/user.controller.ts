import { Controller,Post,Get,Delete,Param,Body, Put } from '@nestjs/common';
import { UserService } from '../service/user.service'
import { User } from '../models/user.interface'
import { Observable,of } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    create(@Body()user:User):Observable<User | Object > {
        return this.userService.create(user).pipe(map((user:User) => user, catchError(err => of(err.message))));
    };
    @Post('/login')
    //  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

    
    @Get(':id')
    findOne(@Param()params):Observable<User> {
        return this.userService.findOne(params.id);  
    };
    @Get()
    findall():Observable<User[]> {
        return this.userService.findall();
        
    };
    @Delete(':id')
    deleteOne(@Param('id')id:string):Observable<any> {
        return this.userService.deleteOne(Number(id));
    }
    @Put(':id')
    UpdateOne(@Param('id')id:string,@Body()user:User):Observable<any> {
        return this.userService.updateOne(Number(id),user);
    }
   
}
