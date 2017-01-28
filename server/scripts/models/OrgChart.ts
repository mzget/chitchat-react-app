export enum OrgLevel {
    department = 0,
    division = 1,
    section = 2,
    unit = 3
}

export interface IOrgChart {
    node_id: number;
    chart_id: number;
    chart_level: OrgLevel;
    chart_name: string;
    chart_description: string;
    chart_manager_id: string;
    report_to_id: string;
}