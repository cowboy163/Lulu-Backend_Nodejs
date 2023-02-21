export enum HttpCode {
    E200 = 200,
    E400 = 400
}

export enum ResStr {
    OK = 'success',
    Deleted = 'Delete completed',

    // DB
    ErrStore = 'Failed to store data',

    // Parameter
    ErrMissingParameter = 'Missing parameter: ',
    ErrParameter = 'Incorrect parameter: ',
    ErrMatch = 'Id is Not Exist',

    // Delete
    ErrDelete = 'Delete Not Completed'

}

export class Result {
    data: any
    code: HttpCode
    msg: string

    constructor(
        data = null,
        msg: string = ResStr.OK,
        code: HttpCode = HttpCode.E200
    ) {
        this.data = data
        this.msg = msg
        this.code = code
    }

    setResultString(msg: string) {
        this.msg = msg
        this.code = HttpCode.E400
    }

    setResultData(data:any, msg: string = ResStr.OK) {
        this.data = data
        this.msg = msg
        if(msg !== ResStr.OK && msg !== ResStr.Deleted) {
            this.code = HttpCode.E400
        }
    }

}