import { ExtractJwt, Strategy } from 'passport-jwt'; // Import JWT extraction and strategy classes from passport-jwt
import { PassportStrategy } from '@nestjs/passport'; // Import the base class for creating a custom Passport strategy
import { Injectable } from '@nestjs/common'; // Import Injectable decorator for dependency injection
import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables
import { AuthService } from '../services/auth.service'; // Import AuthService to potentially use for further user validation

@Injectable() // Mark this class as injectable to be used as a provider in other parts of the application
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Extend PassportStrategy with the JWT strategy
  constructor(
    private configService: ConfigService, // Inject ConfigService to access the JWT secret key from environment variables
    private authService: AuthService, // Inject AuthService to use for additional user validation if needed
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Specify that the JWT should be extracted from the Authorization header as a Bearer token
      ignoreExpiration: false, // Ensure that expired tokens are rejected automatically
      secretOrKey: configService.get<string>('JWT_SECRET'), // Retrieve the secret key from the configuration to validate the JWT's signature
    });
  }

  // The validate method is called automatically after the JWT is successfully decoded
  async validate(payload: any) {
    // In this example, the method returns the user object containing the user data from the JWT payload
    // The returned value will be attached to request.user in the route handlers
    return { user: payload.user };
  }
}
