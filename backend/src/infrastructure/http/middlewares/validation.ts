// import{Request,Response,NextFunction}from 'express';
// import {z} from'zod';

// const availabilitySchema=z.object({
//     month:z.string().regex(/^\d{4}-\d{2}$/) 
// });
// export const validateAvailability=(
//     req:Request,
//     res:Response,
//     next:NextFunction
//     )=>{
//         try{
//             availabilitySchema.parse(req.query);
//             next();
//             }catch{
//                 res.status(400).send({message:'Invalid request month format (use YYYY-MM)'});
//             }
//         }
    