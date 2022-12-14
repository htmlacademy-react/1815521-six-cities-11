import {NameSpace, AuthorizationStatus} from '../../components/const';
import {State} from '../../types/state';

export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[NameSpace.User].authorizationStatus;
export const getUserData = (state: State) => state[NameSpace.User].userData;
