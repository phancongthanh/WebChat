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


// May contain unused imports in some cases
// @ts-ignore
import { Gender } from './gender';

/**
 * 
 * @export
 * @interface UpdateUserCommand
 */
export interface UpdateUserCommand {
    /**
     * 
     * @type {string}
     * @memberof UpdateUserCommand
     */
    'currentUserId': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateUserCommand
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateUserCommand
     */
    'birthday': string;
    /**
     * 
     * @type {Gender}
     * @memberof UpdateUserCommand
     */
    'gender': Gender;
}



