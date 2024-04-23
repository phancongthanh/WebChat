/* tslint:disable */
/* eslint-disable */
/**
 * WebChat.WebAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { SystemInfoOptions } from '../dtos';
/**
 * SystemInfoApi - axios parameter creator
 * @export
 */
export const SystemInfoApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiSystemInfoGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/SystemInfo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SystemInfoApi - functional programming interface
 * @export
 */
export const SystemInfoApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SystemInfoApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiSystemInfoGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SystemInfoOptions>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiSystemInfoGet(options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['SystemInfoApi.apiSystemInfoGet']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * SystemInfoApi - factory interface
 * @export
 */
export const SystemInfoApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SystemInfoApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiSystemInfoGet(options?: any): AxiosPromise<SystemInfoOptions> {
            return localVarFp.apiSystemInfoGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SystemInfoApi - interface
 * @export
 * @interface SystemInfoApi
 */
export interface SystemInfoApiInterface {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemInfoApiInterface
     */
    apiSystemInfoGet(options?: RawAxiosRequestConfig): AxiosPromise<SystemInfoOptions>;

}

/**
 * SystemInfoApi - object-oriented interface
 * @export
 * @class SystemInfoApi
 * @extends {BaseAPI}
 */
export class SystemInfoApi extends BaseAPI implements SystemInfoApiInterface {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SystemInfoApi
     */
    public apiSystemInfoGet(options?: RawAxiosRequestConfig) {
        return SystemInfoApiFp(this.configuration).apiSystemInfoGet(options).then((request) => request(this.axios, this.basePath));
    }
}

