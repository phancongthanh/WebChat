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



/**
 * 
 * @export
 * @interface UpdateFriendInfoCommand
 */
export interface UpdateFriendInfoCommand {
    /**
     * 
     * @type {string}
     * @memberof UpdateFriendInfoCommand
     */
    'currentUserId': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateFriendInfoCommand
     */
    'friendId': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateFriendInfoCommand
     */
    'friendAlias'?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateFriendInfoCommand
     */
    'isBlock': boolean;
}
