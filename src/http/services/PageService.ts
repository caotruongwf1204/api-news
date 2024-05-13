import { AppDataSource } from "@/database/data-source";
import { Content } from "@/database/entities/Content";
import { Page } from "@/database/entities/Page";
import { Section } from "@/database/entities/Section";

export class PageService{
    static async getAllPages(): Promise<[]> {
        try{
        const pageRepository = AppDataSource.getRepository(Page);
        let data: [] = []
        const pages = await pageRepository.find()
        for(let item of pages) {
            let content = []
            const sections = await AppDataSource.getRepository(Section).find({where: {pageId: item.id}})
            for (let sec of sections){
                const contents = await AppDataSource.getRepository(Content).find({where : {id: sec.contentId}, select: ['data']})
                //@ts-ignore
                content.push({section: sec.name, contents: contents})
            }
            //@ts-ignore
            data.push({page: item.name, data: content})
        }
        return data;
    }catch(error){
        throw new Error(`Error: ${error}`)
    }
    
    }
    static async getPageByName(name:string): Promise<{}> {
        try{
        const pageRepository = AppDataSource.getRepository(Page);
        let data: [] = []
        const page = await pageRepository.findOneByOrFail({name: name})
        if (!page) throw new Error(`Page ${name} not found`)
        let content = []
            const sections = await AppDataSource.getRepository(Section).find({where: {pageId: page.id}})
            for (let sec of sections){
                const contents = await AppDataSource.getRepository(Content).find({where : {id: sec.contentId}, select: ['data']})
                //@ts-ignore
                content.push({section: sec.name, contents: contents})
            }
        //@ts-ignore
        data.push({page: page.name, data: content})
        return data;
    }catch(error){
        throw new Error(`Error: ${error}`)
    }
    
    }
}