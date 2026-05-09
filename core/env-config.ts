

// src/environments/environment.ts
export const environmentDev = {
  production: false,
  featureOverrides: {
    'debug-tools': true,
    'beta-mode': true
  }
};

// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  featureOverrides: {
    'debug-tools': false,
    'beta-mode': false
  }
};
