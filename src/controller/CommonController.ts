import {MAX, validate} from "class-validator";
import {ResStr, HttpCode, Result} from "../helper/Result";
import {Order} from "../entity/Order";

export interface ForeignItem {
    name: string,
    field: number | number[],
    foreignRepo: any,
    nullable: boolean,
}

export class CommonController {
    // save the entity into the database
    public static async saveEntity(localRepo, entity, result) {
        try {
            await localRepo.save(entity)
        } catch (e) {
            result.setResultData(e, ResStr.ErrStore)
        }
    }

    // if id exist, return the entity
    public static async checkIdExist(id: number | number[], foreignRepo: any, result: Result, nullable: boolean, name: string = '') {
        let ids: number[] = []
        let index  = 0
        let entities = []

        if(!id && !nullable) {
            result.setResultString(ResStr.ErrParameter + name)
            return
        }
        if(!Array.isArray(id)) {
            ids.push(id)
        } else {
            ids = id
        }

        for(index = 0; index < ids.length; index++) {
            let i = ids[index]

            if(typeof i !== 'number' || i <= 0) {
                if(!nullable) {
                    result.setResultString(`invalid id: ${i}, index: ${index}, name: ${name}`)
                    return
                }
                break
            }

            try {
                let entity = await foreignRepo.findOneOrFail(ids[index])
                // let entity = await foreignRepo.findOneOrFail(1)
                // console.log('c5', entity)
                entities.push(entity)
            } catch (e) {
                if(!nullable) {
                    result.setResultData(e, ResStr.ErrMatch)
                    break
                }
            }
        }

        if(entities.length > 1 || entities.length === 0) {
            return entities
        }
        return entities[0]
    }

    public static async localFieldsCheck(localField, entity, result) {
        if(Object.keys(localField).length > 0) {
            for (let item in localField) {
                entity[item] = localField[item]
            }

            let errors = await validate(entity)
            if (errors.length > 0) {
                result.setResultData(errors, ResStr.ErrParameter)
                return
            }
        }
    }

    public static async  foreignFieldCheck(item, entity, result) {
        try {
            let temp = await CommonController.checkIdExist(item.field, item.foreignRepo, result, item.nullable, item.name)
            if (result.code !== HttpCode.E200) {
                return
            }

            if(Object.keys(temp).length > 0) {
                entity[item.name] = item.field
            }
        } catch (e) {
            result.setResultData(e, ResStr.ErrParameter)
            return
        }
    }

    // check the fields and store them
    public static async fieldCheckAndStore(localField: object, foreignField: Array<ForeignItem>, entity, localRepo, result) {
        await CommonController.localFieldsCheck(localField, entity, result)
        if(result.code !== HttpCode.E200) {
            return
        }

        // if(foreignField.length > 0) {
            for (const item of foreignField) {
                await CommonController.foreignFieldCheck(item, entity, result)
                if(result.code !== HttpCode.E200) {
                    return
                }
            }
        // }
        // get the id !!!
        let idName = Object.keys(localRepo.metadata.propertiesMap)[0]
        const id = await localRepo
            .createQueryBuilder("table")
            .select(`MAX(table.${idName})`, "max")
            .getRawOne()
        id.max++
        entity[idName] = id.max

        await CommonController.saveEntity(localRepo, entity, result)
        if(result.code === HttpCode.E200) {
            result.setResultData(entity)
        }
    }

    // find one or all and return the result with data
    public static async findField(localRepo, result, id: string = '', findOption: object = null) {
        let entity = null
        try {
            if(id === '') {
                entity = await localRepo.find(findOption)
                // entity = await localRepo.createQueryBuilder("order").leftJoinAndSelect("order.order_status", "orderStatus").getMany()
            } else {
                entity = await localRepo.findOneOrFail(id)
            }
        } catch (e) {
            result.setResultData(e, ResStr.ErrMatch)
            return
        }

        // console.log('c1', entity)

        result.setResultData(entity)
    }

    // change the field isDeleted to true
    public static async fieldSoftDelete(entity, localRepo, result) {
        console.log('entity check, ', entity)
        if(entity.isDelete) {
            result.setResultString(ResStr.ErrDelete + ' Record has been deleted already!')
            return
        }

        entity.isDelete = true

        await CommonController.saveEntity(localRepo, entity, result)
        if(result.code === HttpCode.E200) {
            result.setResultData(entity, ResStr.Deleted)
        }
    }
}