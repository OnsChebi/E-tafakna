import { Request, Response } from 'express';
import { RegisterExpertUseCase } from '../../../core/use-cases/authentication/RegisterExpert';
import { ExpertRepositoryImpl } from '../../database/repo/ExpertRepositoryImpl';
import { LoginExpertUseCase } from '../../../core/use-cases/authentication/LoginExpert';
import { getExpertByIdUseCase } from '../../../core/use-cases/expert/GetExpertById';
import { updateExpertProfileUseCase } from '../../../core/use-cases/expert/UpdateExpertProfile';
import { getAllExperts } from '../../../core/use-cases/expert/GetAllExperts';
import { DeleteExpert } from '../../../core/use-cases/expert/DeleteExpert';

const repo = new ExpertRepositoryImpl();

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export async function registerExpertController(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, accessToken,role } = req.body;
    const registerUseCase = new RegisterExpertUseCase(repo);
    const expert = await registerUseCase.execute({ name, email, password, accessToken,role });
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

    res.status(200).json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (e: any) {
    let message = "Login failed";
    if (e.message === "Expert not found") message = "Expert not found";
    if (e.message === "Incorrect password") message = "Incorrect password";

    res.status(400).json({ success: false, message });
  }
};


export async function getProfileController(req: Request, res: Response): Promise<void> {
  try {
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const expert = await getExpertByIdUseCase(expertId, repo);
    if (!expert) {
      res.status(404).json({ message: 'Expert not found' });
      return;
    }

    const BASE_URL = `${req.protocol}://${req.get('host')}`;
    const IMAGE_FOLDER = 'uploads/profile-images/';
    const imageFileName = expert.profileImage?.split('\\').pop()?.split('/').pop();

    const expertWithImageUrl = {
      ...expert,
      profileImage: expert.profileImage
        ? `${BASE_URL}/${IMAGE_FOLDER}${imageFileName}`
        : null
    };

    res.status(200).json(expertWithImageUrl);
  } catch (error) {
    console.error('Error fetching expert profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateProfileController(req: Request, res: Response): Promise<void> {
  try {
    const expertId = (req as AuthenticatedRequest).user?.id;
    const file = req.file;
    const { name, bio } = req.body;

    if (!expertId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const imageFileName = file?.filename || ''; 

    const updatedExpert = await updateExpertProfileUseCase(
      expertId,
      { profileImage: imageFileName, name, bio },
      repo
    );

    if (!updatedExpert) {
      res.status(404).json({ message: 'Expert not found' });
      return;
    }

    const BASE_URL = `${req.protocol}://${req.get('host')}`;
    const IMAGE_FOLDER = 'uploads/profile-images/';

    const updatedWithImageUrl = {
      ...updatedExpert,
      profileImage: imageFileName ? `${BASE_URL}/${IMAGE_FOLDER}${imageFileName}` : null
    };

    res.status(200).json(updatedWithImageUrl);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}




export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usecase = new getAllExperts(repo);
    const users = await usecase.execute();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const usecase = new DeleteExpert(repo);
    await usecase.execute(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

