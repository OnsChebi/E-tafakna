import { comparePassword, generateAccessToken, generateRefreshToken } from '../../../shared/utils/auth';
import { IExpertRepository } from '../../repositories/expert.repository';

interface LoginExpertDTO {
  email: string;
  password: string;
}

export class LoginExpertUseCase {
  constructor(private expertRepository: IExpertRepository) {}

  async execute({ email, password }: LoginExpertDTO) {
    const expert = await this.expertRepository.findByEmail(email);
    if (!expert) throw new Error('Expert not found');

    const isValid = await comparePassword(password, expert.password);
    if (!isValid) throw new Error('Incorrect password');

    const role = expert.role?.trim().toLowerCase();

    const accessToken = generateAccessToken(expert.id, role);
    const refreshToken = generateRefreshToken(expert.id, role);

    await this.expertRepository.updateRefreshToken(expert.id, refreshToken);

    return {
      id: expert.id,
      name: expert.name,
      email: expert.email,
      role,
      accessToken,
      refreshToken
    };
  }
}
