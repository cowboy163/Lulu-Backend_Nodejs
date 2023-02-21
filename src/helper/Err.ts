export enum HttpCode{
    E200 = 200,
    E201 = 201,
    E400 = 400, //input err
    E404 = 404, //not found

}

export enum ErrStr{
    OK = '',

    //DB
    ErrNoObj = 'Cannot find the record',
    ErrStore = 'Failed to store data',
    ErrRead = 'Failed to read data',

    //Parameter
    ErrMissingParameter = 'Missing parameter',
}

export class Err{
    data: any;
    code: number;
    msg: string;


    constructor(code: HttpCode = HttpCode.E200,
                msg: string = ErrStr.OK,
                data = null,
    ) {

        this.data = data
        this.code = code
        this.msg = msg
    }
}