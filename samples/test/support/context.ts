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


import { User } from '@okta/okta-sdk-nodejs';
import {UserCredentials} from './management-api/createCredentials';
import { Scenario } from './scenario';

interface ActionContext {
  credentials: UserCredentials;
  user: User;
  featureName: string;
  scenarioName: string;
  currentTestCaseId: string;
  userName?: string;
  sharedSecret?: string;
  disableEmailVerification?: boolean;
  useProfileEnrollPolicy: boolean;
  customAttribute: string;
  isCurrentScenario: (scenario: Scenario) => boolean;
}

let reusedContext: ActionContext;
export const getReusedContext = () => {
  return reusedContext;
};
export const reuseContext = (context: ActionContext) => {
  reusedContext = context;
};

export default ActionContext;
