import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { User } from '../../user/models/user.interface';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }
 generateJWT(user:User):Observable<string>{
    return from(this.jwtService.signAsync({user}));
    } 
 hashPassword(password:string):Observable<string>{
    return from<string>(bcrypt.hash(password, 12))
    
    } 
 comparePassword(newPassword:string, PasswordHash:string):Observable<any>{
    return of<any | boolean >(bcrypt.compare(newPassword,PasswordHash))
 }   
}

