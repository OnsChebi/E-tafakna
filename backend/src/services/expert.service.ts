import { AppDataSource } from "../database/db";
import { Expert } from "../entities/Expert.entity";
import { hashPassword } from "../utils/auth";

export const createExpert = async (name:string,email:string,password:string)=>{
    const expertRepository = AppDataSource.getRepository(Expert);
    const hashedPassword = await hashPassword(password);
    const expert = expertRepository.create({name,email,password:hashedPassword});

    return await expertRepository.save(expert);
};
export const findExpertByEmail= async (email:string)=>{
    const expertRepository = AppDataSource.getRepository(Expert);
    return await expertRepository.findOne({where:{email}});
}