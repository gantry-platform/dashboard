import { KeycloakOptions } from 'keycloak-angular';

const keycloakOptions: KeycloakOptions = {
  config: {
    url: 'https://keycloak.mgmt.dev.gantry.ai/auth',
    realm: 'sso-dev',
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
  userManagementRestApi: 'https://gantryuser.mgmt.dev.gantry.ai'
};