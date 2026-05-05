


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