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


import LoginForm from '../selectors/LoginForm';
import OktaSignInOIE from '../selectors/OktaSignInOIE';

const getLoginForm = (featureName: string) => {
  switch (featureName) {
    case 'Basic Login with Embedded Sign In Widget':
      return OktaSignInOIE;
    default:
      return LoginForm;
  }
};

export default getLoginForm;
