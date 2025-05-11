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
    if (!isValid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: expert.id, email: expert.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '6h' }
    );

    return { id: expert.id, name: expert.name, email: expert.email, token };
  }
}