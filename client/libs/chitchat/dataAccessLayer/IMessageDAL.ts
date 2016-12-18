export interface IMessageDAL {
    getData(rid: string, done: (err, message) => void);
    saveData(rid: string, chatRecord: Array<any>, callback?: (err, result) => void);
    removeData(rid: string, callback?: (err, res) => void);
    clearData(next: (err?: Error) => void);
}