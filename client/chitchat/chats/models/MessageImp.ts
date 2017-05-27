import { IMessage, IMessageMeta } from "../../shared/Message";

export class MessageImp implements IMessage {
    _id: string;
    rid: string;
    type: string;
    body: string;
    src: any;
    sender: string;
    createTime: Date;
    readers: string[];
    meta: IMessageMeta;
    target: string;
    user: { _id: string, username: string, avatar: string };
    uuid: number;
    status: string;
}