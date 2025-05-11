import { Request, Response } from 'express';
import { RegisterExpertUseCase } from '../../../core/use-cases/RegisterExpert';
import { ExpertRepositoryImpl } from '../../database/repo/ExpertRepositoryImpl';
import { LoginExpertUseCase } from '../../../core/use-cases/LoginExpert';

const repo = new ExpertRepositoryImpl();
const useCase = new RegisterExpertUseCase(repo);

export async function registerExpertController(req: Request, res: Response) {
  try {
    const { name, email, password, accessToken } = req.body;
    const expert = await useCase.execute({ name, email, password, accessToken });
    res.status(201).json(expert);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const useCase = new LoginExpertUseCase(repo);

  try {
    const result = await useCase.execute({ email, password });
    res.json(result);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
};