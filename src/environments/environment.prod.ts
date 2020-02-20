import { KeycloakOptions } from 'keycloak-angular';

const keycloakOptions: KeycloakOptions = {
  config: {
    url: 'https://keycloak.gantry.ai/auth',
    realm: 'gantry',
    clientId: 'dashboard'
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: false
  },
  enableBearerInterceptor: true,
  bearerExcludedUrls: ['/assets', '/clients/public']
}

export const environment = {
  production: true,
  keycloakOptions: keycloakOptions
};
