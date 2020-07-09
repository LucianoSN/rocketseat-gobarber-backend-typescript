import { hash } from 'bcryptjs';
import { getRepository, Repository } from 'typeorm';
import User from '../models/User';
import AppError from '../errors/AppError';

type Request = {
    name: string;
    email: string;
    password: string;
};

class CreateUserService {
    usersRepository: Repository<User>;

    constructor() {
        this.usersRepository = getRepository(User);
    }

    public async execute({ name, email, password }: Request): Promise<User> {
        await this.checkUserExists({ email });

        const hashedPassword = await hash(password, 8);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    private checkUserExists = async ({
        email,
    }: Omit<Request, 'name' | 'password'>): Promise<void> => {
        const exists = await this.usersRepository.findOne({
            where: { email },
        });

        if (exists) {
            throw new AppError('Email address already used.');
        }
    };
}

export default CreateUserService;
