import { hashPassword, secureToken } from "../../../shared/utils/auth";
import { Expert } from "../../entities/Expert.entity";
import { IExpertRepository } from "../../repositories/expert.repository";

export class RegisterExpertUseCase {
  constructor(private repo: IExpertRepository) {}

  async execute({ name, email, password, accessToken, role  }: {
    name: string;
    email: string;
    password: string;
    accessToken: string;
    role?:'expert';
  }): Promise<Expert> {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error('Email already in use');

    const expert = new Expert();
    expert.name = name;
    expert.email = email;
    expert.password = await hashPassword(password);
    expert.role = role || 'expert';
    if (accessToken) {
  expert.accessToken = await secureToken(accessToken);
}
    return await this.repo.create(expert);
  }
}