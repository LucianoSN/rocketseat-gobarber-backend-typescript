import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import User from '../models/User';
import authConfig from '../config/auth';

type Request = {
    email: string;
    password: string;
};

type Response = {
    user: User;
    token: string;
};

type PasswordMatch = {
    password: string;
    user: User;
};

const ERROR_MESSAGE = 'Incorrect email/password combination.';

class AuthenticateUserService {
    usersRepository: Repository<User>;

    constructor() {
        this.usersRepository = getRepository(User);
    }

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.userExists({ email });
        await this.passwordIsEqual({ password, user });

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }

    private userExists = async ({
        email,
    }: Omit<Request, 'password'>): Promise<User> => {
        const user = await this.usersRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error(ERROR_MESSAGE);
        }

        return user;
    };

    private passwordIsEqual = async ({
        password,
        user,
    }: PasswordMatch): Promise<void> => {
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error(ERROR_MESSAGE);
        }
    };
}

export default AuthenticateUserService;
