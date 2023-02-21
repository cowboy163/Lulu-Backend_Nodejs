// import exp = require("constants");

export interface IdCheckRes{
    index: number,
    entities: any[]
}
export class MkController {
    public static async checkIdExists(ids: number[], repo: any):Promise<IdCheckRes>{
        let index = 0
        let entities = []
        let res: IdCheckRes = {index : -1, entities}

        for (index = 0; index < ids.length; index++){
            try{
                let entity = await repo.findOneOrFail(ids[index])
                res.entities.push(entity)
                console.log("01")
            }catch (e){
                break
                console.log("02")
            }
        }

        if (index === ids.length) {
            res.index = -1
            console.log("03")
        } else {
            res.index = ids[index]
            console.log("04")
        }
        return res
    }

}