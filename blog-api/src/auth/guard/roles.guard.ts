import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/service/user.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/models/user.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user.user;

    console.log('user is ', user);
    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        console.log(user);
        console.log(roles);
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;
        if (hasRole()) {
          console.log('hasRole becomes true');
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
  }
}
