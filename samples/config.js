/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */

const GENERATE_TYPE_FULL = 'full';
const GENERATE_TYPE_OVERWRITE = 'overwrite';

const defaults = {
  port: '8080'
};

const spaDefaults = Object.assign({
  redirectPath: '/login/callback',
  authMethod: 'form',
  scopes: ['openid', 'email'],
  storage: 'sessionStorage',
  requireUserSession: true,
  signinForm: true,
  mfa: true,
  authn: true,
  signinWidget: true,
  emailVerify: false // set to true once tested/ready for public release
}, defaults);

const webDefaults = Object.assign({
  redirectPath: '/authorization-code/callback',
  oidc: true
}, defaults);

const templateDefaults = {
  'static-spa': Object.assign({
    webpack: false
  }, spaDefaults),
  'webpack-spa': Object.assign({
    webpack: true
  }, spaDefaults),
  'express-web': Object.assign({
    express: true
  }, webDefaults)
};

const samples = [
  {
    name: '@okta/samples.static-spa',
    template: 'static-spa',
    generateType: GENERATE_TYPE_FULL,
    specs: ['spa-app'],
    features: []
  },
  {
    name: '@okta/samples.webpack-spa',
    template: 'webpack-spa',
    generateType: GENERATE_TYPE_FULL,
    specs: ['spa-app'],
    features: []
  },
  {
    name: '@okta/samples.express-web-no-oidc',
    template: 'express-web',
    generateType: GENERATE_TYPE_FULL,
    specs: ['web-app'],
    oidc: false
  },
  {
    name: '@okta/samples.express-web-with-oidc',
    template: 'express-web',
    generateType: GENERATE_TYPE_FULL,
    specs: ['web-app']
  },
  {
    name: '@okta/samples.express-embedded-auth-with-sdk',
    template: 'express-embedded-auth-with-sdk',
    generateType: GENERATE_TYPE_OVERWRITE,
    specs: ['express-embedded-auth-with-sdk'],
    features: [
      'root-page', 
      'basic-auth', 
      'self-service-password-recovery', 
      'self-service-registration',
      'self-service-registration-custom-attribute',
      'self-service-registration-activation-token',
      'mfa-password-and-email',
      'mfa-password-and-sms',
      'social-login-mfa',
      'social-idp',
      'totp-signup',
      'totp-signin',
    ],
    useEnv: true,
    express: true,
  },
  {
    name: '@okta/samples.express-embedded-sign-in-widget',
    template: 'express-embedded-sign-in-widget',
    generateType: GENERATE_TYPE_OVERWRITE,
    specs: [],
    features: [
      'embedded-widget-basic-auth',
      'social-idp-with-widget'
    ],
    useEnv: true
  },
  {
    name: '@okta/test.app.react-oie',
    features: [
      'progressive-profiling-view-profile'
    ],
    useEnv: true
  },
].map(function(sampleConfig) {
  if (!sampleConfig.name) {
    throw new Error('sample "name" is required');
  }
  const mergedConfig = Object.assign({}, templateDefaults[sampleConfig.template], sampleConfig);
  return mergedConfig;
});

function getSampleConfig(sampleName) {
  const configEntries = samples.filter(val => val.name === sampleName);
  const sampleConfig = configEntries.length ? configEntries[0] : null;
  return sampleConfig;
}

function getSamplesConfig() {
  return samples;
}

function getSampleNames() {
  return samples.map(sample => sample.name).filter(name => {
    if (process.env.SAMPLE_NAME) {
      return name === process.env.SAMPLE_NAME;
    }
    return true;
  });
}

module.exports = {
  getSampleNames,
  getSampleConfig,
  getSamplesConfig,
  GENERATE_TYPE_FULL,
  GENERATE_TYPE_OVERWRITE
};
