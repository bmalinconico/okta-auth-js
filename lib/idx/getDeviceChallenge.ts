/* eslint-disable complexity */
/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { makeIdxState, validateVersionConfig } from './idxState';
import { IntrospectOptions, OktaAuthIdxInterface } from './types';
import { IdxRemediation, IdxResponse, isRawIdxResponse } from './types/idx-js';
import { IDX_API_VERSION } from '../constants';
import { httpRequest } from '../http';
import { isAuthApiError } from '../errors';

export async function getDeviceChallenge (
  authClient: OktaAuthIdxInterface,
  remediation: IdxRemediation,
  options: IntrospectOptions = {}
): Promise<IdxResponse> {
  let rawIdxResponse;
  let requestDidSucceed;

  // try load from storage first
  const savedIdxResponse = authClient.transactionManager.loadIdxResponse(options);
  if (savedIdxResponse) {
    rawIdxResponse = savedIdxResponse.rawIdxResponse;
    requestDidSucceed = savedIdxResponse.requestDidSucceed;
  }

  if (!rawIdxResponse) {
    const version = options.version || IDX_API_VERSION;
    const withCredentials = false;
    try {
      requestDidSucceed = true;
      validateVersionConfig(version);
      // remediation.href already contains domain, otherwise get domain from getOAuthDomain(authClient);
      const url = remediation.href;
      const headers = {
        'Content-Type': `application/ion+json; okta-version=${version}`,
        Accept: `application/ion+json; okta-version=${version}`,
      };
      rawIdxResponse = await httpRequest(authClient, {
        method: 'GET',
        url,
        headers,
        withCredentials
      });
    } catch (err) {
      if (isAuthApiError(err) && err.xhr && isRawIdxResponse(err.xhr.responseJSON)) {
        rawIdxResponse = err.xhr.responseJSON;
        requestDidSucceed = false;
      } else {
        throw err;
      }
    }
  }

  const { withCredentials } = options;
  return makeIdxState(authClient, rawIdxResponse, { withCredentials }, requestDidSucceed);
}
