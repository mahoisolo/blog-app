import { UserService } from 'src/user/service/user.service'; // Service for handling user-related operations
import { Observable } from 'rxjs'; // Not used in this example, but could be used if canActivate returns an Observable
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'; // Core NestJS utilities for guards and dependency injection
import { Reflector } from '@nestjs/core'; // Utility for accessing custom metadata, like roles

@Injectable() // Marks the RoleGuard as a provider that can be injected into controllers or other providers
export class RoleGuard implements CanActivate {
  // Implements the CanActivate interface to create a custom guard
  constructor(
    private reflector: Reflector, // Injects the Reflector service to access metadata on route handlers
    private userService: UserService, // Injects the UserService to possibly retrieve user details or roles
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // canActivate method that determines whether the route can be accessed
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); // Retrieve the roles metadata attached to the route handler
    if (!roles) {
      // If no roles are specified, allow unrestricted access
      return true;
    }

    const request = context.switchToHttp().getRequest(); // Extract the HTTP request from the execution context
    console.log(request); // Log the request for debugging purposes (can be removed in production)

    const user = request.user; // Extract the user from the request object (assumed to be attached after JWT validation)
    // TODO: Add logic to check if the user's roles match the required roles

    return true; // Currently allows all requests; should be modified to enforce role-based access control
  }
}
