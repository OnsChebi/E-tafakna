import { Expert } from "../entities/Expert.entity";

export interface IExpertRepository {
  create(expert: Expert): Promise<Expert>;
  findByEmail(email: string): Promise<Expert | null>;
  findById(id:number):Promise<Expert|null>;
  update (id:number,data:Partial<Expert>):Promise<Expert|null>;
}
//implementation TypOrm with this interface
// decouple business logic 3l db