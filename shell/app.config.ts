export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (shell: Shell) => () => shell.init(),
      deps: [Shell],
      multi: true,
    },
  ],
};
