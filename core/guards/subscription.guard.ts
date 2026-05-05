


// canActivate: [subscriptionGuard(['pro', 'enterprise'])]
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private requiredPlans: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Assuming user.subscriptionPlan contains the user's current subscription plan
    return this.requiredPlans.includes(user.subscriptionPlan);
  }
}

    // switchtohttp() is used to access the underlying HTTP request object in a NestJS application. In the context of a guard, it allows you to retrieve the request and access properties such as the user information, headers, etc., which can be crucial for making authorization decisions.
//     ExecutionContext can represent:

// HTTP request

// WebSocket message

// GraphQL resolver

// RPC call

// Microservice event