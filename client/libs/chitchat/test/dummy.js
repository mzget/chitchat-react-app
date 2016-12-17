class Dummy {
    constructor() {
        this.chatRoom = ChatServer.ChatRoomApiProvider.prototype;
        this.bots = [{ name: "test1@rfl.com", pass: "1234" }, { name: "test2@rfl.com", pass: "1234" },
            { name: "test3@rfl.com", pass: "1234" }, { name: "test4@rfl.com", pass: "1234" }, { name: "test5@rfl.com", pass: "1234" },
            { name: "test6@rfl.com", pass: "1234" }, { name: "test7@rfl.com", pass: "1234" }];
        this.serverApi = ChatServer.ServerImplemented.getInstance();
    }
    getBot() {
        var r = Math.floor((Math.random() * this.bots.length) + 1);
        return this.bots[r];
    }
    fireChatInRoom(myUid) {
        this.serverApi.JoinChatRoomRequest("55d5bb67451bbf090b0e8cde", (err, res) => {
            if (!err && res !== null) {
                setInterval(() => {
                    this.chatRoom.chat("55d5bb67451bbf090b0e8cde", "bot", myUid, "test for bot", ContentType[ContentType.Text], function (err, res) {
                        console.log(res);
                    });
                }, 1000);
            }
        });
    }
}
/*
{
    "_id" : ObjectId("55d5bb67451bbf090b0e8cde"),
    "name" : "SkylineDeveloper",
    "type" : 2,
    "members" : [
        {
            "id" : "55d1929fd20212707c46c688"
        }
    ],
    "createTime" : ISODate("2015-08-20T11:35:03.066Z"),
    "image" : "/uploads/groups/images/4b8560d8b445d3c48a0b076b1b4c8139.jpg"
}
*/ 
