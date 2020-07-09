import fs from 'fs';
import path from 'path';
import { getRepository, Repository } from 'typeorm';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

type Request = {
    user_id: string;
    avatarFilename: string;
};

class UpdateUserAvatarService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const user = await this.userRepository.findOne(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticate users can change avatar.',
                401
            );
        }

        await this.removeAvatarIfExists(user);

        user.avatar = avatarFilename;
        await this.userRepository.save(user);

        return user;
    }

    private removeAvatarIfExists = async (user: User): Promise<void> => {
        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar
            );

            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }
    };
}

export default UpdateUserAvatarService;
