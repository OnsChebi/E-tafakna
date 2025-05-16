import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IExpertRepository } from '../repositories/expert.repository';

interface LoginExpertDTO {
  email: string;
  password: string;
}

export class LoginExpertUseCase {
  constructor(private expertRepository: IExpertRepository) {}

  async execute({ email, password }: LoginExpertDTO) {
    const expert = await this.expertRepository.findByEmail(email);
    if (!expert) throw new Error('Expert not found');

    const isValid = await compare(password, expert.password);
    if (!isValid) throw new Error('Incorrect password');

    const token = jwt.sign({ id: expert.id }, process.env.JWT_SECRET!, {
      expiresIn: "4h"
    });

    return { id: expert.id, name: expert.name, email: expert.email,role:expert.role, token };
  }
}