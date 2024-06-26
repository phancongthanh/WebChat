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
import { ConversationType } from './conversation-type';
// May contain unused imports in some cases
// @ts-ignore
import { Message } from './message';
// May contain unused imports in some cases
// @ts-ignore
import { MessageStatus } from './message-status';

/**
 * 
 * @export
 * @interface ConversationInfo
 */
export interface ConversationInfo {
    /**
     * 
     * @type {ConversationType}
     * @memberof ConversationInfo
     */
    'type': ConversationType;
    /**
     * 
     * @type {string}
     * @memberof ConversationInfo
     */
    'conversationId': string;
    /**
     * 
     * @type {MessageStatus}
     * @memberof ConversationInfo
     */
    'status': MessageStatus;
    /**
     * 
     * @type {Array<Message>}
     * @memberof ConversationInfo
     */
    'messages': Array<Message>;
    /**
     * 
     * @type {boolean}
     * @memberof ConversationInfo
     */
    'isHidden': boolean;
    /**
     * 
     * @type {number}
     * @memberof ConversationInfo
     */
    'receivedToId': number;
    /**
     * 
     * @type {number}
     * @memberof ConversationInfo
     */
    'seenToId': number;
    /**
     * 
     * @type {number}
     * @memberof ConversationInfo
     */
    'loadFromId': number;
    /**
     * 
     * @type {boolean}
     * @memberof ConversationInfo
     */
    'isBlock': boolean;
    /**
     * 
     * @type {Array<number>}
     * @memberof ConversationInfo
     */
    'hiddenMessageIds': Array<number>;
}



