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
import { GroupMember } from './group-member';
// May contain unused imports in some cases
// @ts-ignore
import { GroupSetting } from './group-setting';
// May contain unused imports in some cases
// @ts-ignore
import { JoinInvitation } from './join-invitation';
// May contain unused imports in some cases
// @ts-ignore
import { JoinRequest } from './join-request';

/**
 * 
 * @export
 * @interface Group
 */
export interface Group {
    /**
     * 
     * @type {Array<object>}
     * @memberof Group
     */
    'domainEvents': Array<object>;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'created': string;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'createdBy'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'lastModified': string;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'lastModifiedBy'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'groupId': string;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'avatarPath'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'name': string;
    /**
     * 
     * @type {number}
     * @memberof Group
     */
    'numberOfMembers': number;
    /**
     * 
     * @type {Array<JoinRequest>}
     * @memberof Group
     */
    'joinRequests': Array<JoinRequest>;
    /**
     * 
     * @type {Array<JoinInvitation>}
     * @memberof Group
     */
    'joinInvitations': Array<JoinInvitation>;
    /**
     * 
     * @type {Array<GroupMember>}
     * @memberof Group
     */
    'members': Array<GroupMember>;
    /**
     * 
     * @type {GroupSetting}
     * @memberof Group
     */
    'setting': GroupSetting;
    /**
     * 
     * @type {string}
     * @memberof Group
     */
    'conversationId': string;
}
