export interface ApiResponse<T> {
    id: any;
    succeeded: any;
    recordsFiltered: number;
    recordsTotal: number;
    statusCode:number;
    message:string
    data: any[];
    }