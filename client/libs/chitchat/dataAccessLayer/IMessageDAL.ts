export interface IMessageDAL {
    getData(rid: string): Promise<any>;
    saveData(rid: string, chatRecord: Array<any>): Promise<any>;
    removeData(rid: string, callback?: (err, res) => void);
    clearData(next: (err?: Error) => void);
}