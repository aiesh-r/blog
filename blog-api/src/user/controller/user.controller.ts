import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // login
  @Post('/login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
      catchError((err) => of({ error: err.message })),
    );
  }

  // add user
  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  // find all users
  @Get(':id')
  findOne(@Param('id') id: string): Observable<User> {
    return this.userService.findOne(Number(id));
  }

  // find one user
  @Get()
  index(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({
      limit,
      page,
      route: 'http://localhost/users',
    });
  }

  // update user
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  // delete user
  @Delete(':id')
  deleteUser(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  // update user role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.ADMIN)
  @Put(':id/role')
  updateUserRole(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
