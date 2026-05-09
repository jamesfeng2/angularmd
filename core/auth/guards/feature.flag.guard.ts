


// canMatch: [featureFlagGuard('newDashboard')]
import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment } from '@angular/router';
import { FeatureFlagService } from '../services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuard implements CanMatch {
  constructor(private featureFlagService: FeatureFlagService) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const requiredFeature = route.data?.['requiredFeature'];
    if (!requiredFeature) {
      return true; // No feature flag specified, allow access
    }
    return this.featureFlagService.isFeatureEnabled(requiredFeature);
  }
}