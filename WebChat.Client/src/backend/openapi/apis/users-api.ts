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
import { UpdateUserCommand } from '../dtos';
// @ts-ignore
import { User } from '../dtos';
// @ts-ignore
import { UserInfo } from '../dtos';
/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersCurrentGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/Users/Current`;
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
        /**
         * 
         * @param {string} [country] 
         * @param {string} [phone] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPhoneNumberGet: async (country?: string, phone?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/Users/PhoneNumber`;
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

            if (country !== undefined) {
                localVarQueryParameter['country'] = country;
            }

            if (phone !== undefined) {
                localVarQueryParameter['phone'] = phone;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {Array<string>} [requestBody] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPost: async (requestBody?: Array<string>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/Users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(requestBody, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {UpdateUserCommand} [updateUserCommand] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPut: async (updateUserCommand?: UpdateUserCommand, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/Users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateUserCommand, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersUserIdGet: async (userId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('apiUsersUserIdGet', 'userId', userId)
            const localVarPath = `/api/Users/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
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
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersCurrentGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersCurrentGet(options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['UsersApi.apiUsersCurrentGet']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {string} [country] 
         * @param {string} [phone] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersPhoneNumberGet(country?: string, phone?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInfo>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersPhoneNumberGet(country, phone, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['UsersApi.apiUsersPhoneNumberGet']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {Array<string>} [requestBody] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersPost(requestBody?: Array<string>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserInfo>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersPost(requestBody, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['UsersApi.apiUsersPost']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {UpdateUserCommand} [updateUserCommand] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersPut(updateUserCommand?: UpdateUserCommand, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersPut(updateUserCommand, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['UsersApi.apiUsersPut']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersUserIdGet(userId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInfo>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersUserIdGet(userId, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['UsersApi.apiUsersUserIdGet']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersCurrentGet(options?: any): AxiosPromise<User> {
            return localVarFp.apiUsersCurrentGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} [country] 
         * @param {string} [phone] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPhoneNumberGet(country?: string, phone?: string, options?: any): AxiosPromise<UserInfo> {
            return localVarFp.apiUsersPhoneNumberGet(country, phone, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {Array<string>} [requestBody] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPost(requestBody?: Array<string>, options?: any): AxiosPromise<Array<UserInfo>> {
            return localVarFp.apiUsersPost(requestBody, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {UpdateUserCommand} [updateUserCommand] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersPut(updateUserCommand?: UpdateUserCommand, options?: any): AxiosPromise<void> {
            return localVarFp.apiUsersPut(updateUserCommand, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersUserIdGet(userId: string, options?: any): AxiosPromise<UserInfo> {
            return localVarFp.apiUsersUserIdGet(userId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UsersApi - interface
 * @export
 * @interface UsersApi
 */
export interface UsersApiInterface {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    apiUsersCurrentGet(options?: RawAxiosRequestConfig): AxiosPromise<User>;

    /**
     * 
     * @param {string} [country] 
     * @param {string} [phone] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    apiUsersPhoneNumberGet(country?: string, phone?: string, options?: RawAxiosRequestConfig): AxiosPromise<UserInfo>;

    /**
     * 
     * @param {Array<string>} [requestBody] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    apiUsersPost(requestBody?: Array<string>, options?: RawAxiosRequestConfig): AxiosPromise<Array<UserInfo>>;

    /**
     * 
     * @param {UpdateUserCommand} [updateUserCommand] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    apiUsersPut(updateUserCommand?: UpdateUserCommand, options?: RawAxiosRequestConfig): AxiosPromise<void>;

    /**
     * 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApiInterface
     */
    apiUsersUserIdGet(userId: string, options?: RawAxiosRequestConfig): AxiosPromise<UserInfo>;

}

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends BaseAPI implements UsersApiInterface {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public apiUsersCurrentGet(options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).apiUsersCurrentGet(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} [country] 
     * @param {string} [phone] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public apiUsersPhoneNumberGet(country?: string, phone?: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).apiUsersPhoneNumberGet(country, phone, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {Array<string>} [requestBody] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public apiUsersPost(requestBody?: Array<string>, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).apiUsersPost(requestBody, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {UpdateUserCommand} [updateUserCommand] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public apiUsersPut(updateUserCommand?: UpdateUserCommand, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).apiUsersPut(updateUserCommand, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public apiUsersUserIdGet(userId: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).apiUsersUserIdGet(userId, options).then((request) => request(this.axios, this.basePath));
    }
}

