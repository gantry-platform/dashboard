import { KeycloakOptions } from 'keycloak-angular';

const keycloakOptions: KeycloakOptions = {
  config: {
    url: 'https://keycloak.gantry.ai/auth',
    realm: 'gantry-service-test',
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
  userManagementRestApi: 'http://localhost:8080'
};
