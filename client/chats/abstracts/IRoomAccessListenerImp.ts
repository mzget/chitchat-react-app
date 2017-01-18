export interface IRoomAccessListenerImp {
    onChat(dataEvent);
    onAccessRoom(dataEvent);
    onUpdatedLastAccessTime(dataEvent);
    onAddRoomAccess(dataEvent);
}