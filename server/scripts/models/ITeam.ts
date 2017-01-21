export interface ITeam {
     _id: string;
     name: string;
     detail: string;
     image: string;
     jobPosition: string[];
     defaultGroup: string;
     groups: string[];
     createAt: Date;
}