import { KeycloakOptions } from 'keycloak-angular';

const keycloakOptions: KeycloakOptions = {
  config: {
    url: 'https://keycloak.dev.gantry.ai/auth',
    realm: 'gantry',
    clientId: 'dashboard'
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false
  },
  enableBearerInterceptor: true,
  bearerExcludedUrls: ['/assets']
}

export const environment = {
  production: false,
  keycloakOptions: keycloakOptions,
  userManagementRestApi: 'https://user.dev.gantry.ai'
};