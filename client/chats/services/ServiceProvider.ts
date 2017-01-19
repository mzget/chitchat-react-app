import config from '../../configs/config';

require('isomorphic-fetch');

export const getRoomInfo = (user_id: string, room_id: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/roomInfo?user_id=${user_id}&room_id=${room_id}`);
}

export const getUnreadMessage = (user_id: string, room_id: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/unreadMessage?user_id=${user_id}&room_id=${room_id}&lastAccessTime=${lastAccessTime}`);
}