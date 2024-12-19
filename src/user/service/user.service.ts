import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.enetity';
import { Observable, from, throwError, of } from 'rxjs';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.password = passwordHash;
        newUser.email = user.email;

        return from(this.userRepository.save(newUser)).pipe(
          map((savedUser: UserEntity) => {
            const { password, ...result } = savedUser;
            return result as User;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findall(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: UserEntity[]) => {
        return users.map((user) => {
          const { password, ...result } = user;
          return result as User;
        });
      }),
    );
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: UserEntity) => {
        const { password, ...result } = user;
        return result as User;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((validatedUser: User) => {
        if (validatedUser) {
          return this.authService
            .generateJWT(validatedUser)
            .pipe(map((jwt: string) => jwt));
        } else {
          return throwError('Wrong Email or Password');
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: UserEntity) => {
        return this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result as User;
            } else {
              throw new Error('Wrong Password');
            }
          }),
        );
      }),
    );
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((user: UserEntity) => {
        if (user) {
          const { password, ...result } = user;
          return result as User;
        } else {
          throw new Error('User not found');
        }
      }),
    );
  }
}
