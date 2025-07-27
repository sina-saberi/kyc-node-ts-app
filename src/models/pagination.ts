import { Request, Response } from 'express';

export class Pagination<TData> {
    private page: number;
    private pageSize: number;
    private start: number;
    private end: number;
    constructor({
        query: {
            page,
            pageSize
        }
    }: Request) {
        this.page = parseInt(page as string) || 1;
        this.pageSize = parseInt(pageSize as string) || 10;
        this.start = (this.page - 1) * this.pageSize;
        this.end = this.start + this.pageSize;
    }


    getResponse(data: TData[], res: Response) {

        res.json({
            total: data.length,
            page: this.page,
            pageSize: this.pageSize,
            totalPages: Math.ceil(data.length / this.pageSize),
            data: data
        });
    }
}