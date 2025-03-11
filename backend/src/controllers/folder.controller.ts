// import { Expert } from '@entities/Expert.entity';
// import { Folder } from '@entities/Folder.entity';
// import { AppDataSource } from 'database/db';
// import { Request, Response } from 'express';

// export const createFolder = async (req:Request, res:Response)=>{
//     const {name} = req.body;
//     const expertId =res.user.id;

// try{
//     const expertRepository = AppDataSource.getRepository(Expert);
//     const expert = await expertRepository.findOne({where :{id:expertId}});

//     if (!expert){
//         return res.status(404).json({message:"Expert not found"});
//     }
//     const folderRepository =AppDataSource.getRepository(Folder);
//     const existingFolder=await folderRepository.findOne({where:{name:name,expert:{id:expertId}}});
//     if(existingFolder){
//         return res.status(400).json({message:"Folder already exists"});
//         }
//     const newFolder = folderRepository.create({name,expert});
//     await folderRepository.save(newFolder);
//     return res.status(201).json({message:"Folder created successfully"});
//     }catch(error){
//         res.status(500).json({ message: "Server error", error });
//     }

// }