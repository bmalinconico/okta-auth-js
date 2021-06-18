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


import type { Selector } from 'webdriverio';

/**
 * Check if the given selector is enabled
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Whether to check if the given selector
 *                              is enabled or not
 */
export default (selector: Selector, falseCase: boolean) => {
    /**
     * The enabled state of the given selector
     * @type {Boolean}
     */
    const isEnabled = $(selector).isEnabled();

    if (falseCase) {
        expect(isEnabled).not.toEqual(
            true,
            // @ts-expect-error
            `Expected element "${selector}" not to be enabled`
        );
    } else {
        expect(isEnabled).toEqual(
            true,
            // @ts-expect-error
            `Expected element "${selector}" to be enabled`
        );
    }
};
