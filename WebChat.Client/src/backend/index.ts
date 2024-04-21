import auth from "./auth";
import axiosClient from "./axios";
import AvatarsClient from "./clients/avatars-client";
import ConversationsClient from "./clients/conversations-client";
import FriendsClient from "./clients/friends-client";
import GroupsClient from "./clients/groups-client";
import UsersClient from "./clients/users-client";
import { AvatarsApi, Configuration, ConversationsApi, FriendsApi, GroupsApi, UsersApi } from "./openapi";
import SignalRSocket from "./sockets/SignalRSocket";

// configuration
const basePath = "";
const configuration = new Configuration({
  basePath,
  accessToken: auth.getAccessToken,
});

// apis
const usersApi = new UsersApi(configuration, basePath, axiosClient);
const avatarsApi = new AvatarsApi(configuration, basePath, axiosClient);
const friendsApi = new FriendsApi(configuration, basePath, axiosClient);
const groupsApi = new GroupsApi(configuration, basePath, axiosClient);
const conversationaApi = new ConversationsApi(configuration, basePath, axiosClient);

// clients
export const usersClient = new UsersClient(usersApi);
export const avatarsClient = new AvatarsClient(avatarsApi, configuration);
export const friendsClient = new FriendsClient(friendsApi);
export const groupsClient = new GroupsClient(groupsApi);
export const conversationsClient = new ConversationsClient(conversationaApi);

// socket
export const socket = new SignalRSocket("/hub/Application", auth.getAccessToken);
