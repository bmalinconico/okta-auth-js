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
 *
 */
import { AuthSdkError } from '../errors';
import { getOAuthUrls } from './util/oauth';
import { isSameRefreshToken } from './util/refreshToken';
import { OktaAuthOAuthInterface, TokenParams, RefreshToken, Tokens } from './types';
import { handleOAuthResponse } from './handleOAuthResponse';
import { postRefreshToken } from './endpoints/token';
import { isRefreshTokenInvalidError } from './util/errors';

export async function renewTokensWithRefresh(
  sdk: OktaAuthOAuthInterface,
  tokenParams: TokenParams,
  refreshTokenObject: RefreshToken
): Promise<Tokens> {
  const { clientId } = sdk.options;
  if (!clientId) {
    throw new AuthSdkError('A clientId must be specified in the OktaAuth constructor to renew tokens');
  }

  try {
    const renewTokenParams: TokenParams = Object.assign({}, tokenParams, {
      clientId,
    });
    const tokenResponse = await postRefreshToken(sdk, renewTokenParams, refreshTokenObject);
    const urls = getOAuthUrls(sdk, tokenParams);
    const { tokens } = await handleOAuthResponse(sdk, renewTokenParams, tokenResponse, urls);

    // Support rotating refresh tokens
    const { refreshToken } = tokens;
    if (refreshToken && !isSameRefreshToken(refreshToken, refreshTokenObject)) {
      // TODO: remove tokenManager dependency
      // @ts-ignore
      sdk.tokenManager.updateRefreshToken(refreshToken);
    }

    return tokens;
  }
  catch (err) {
    if (isRefreshTokenInvalidError(err)) {
      // if the refresh token is invalid, remove it from storage
      // TODO: remove tokenManager dependency
      // @ts-ignore
      sdk.tokenManager.removeRefreshToken();
    }
    throw err;
  }
}
