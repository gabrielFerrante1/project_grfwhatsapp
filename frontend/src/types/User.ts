export type User = {
    id: number;
    avatar: string;
    name: string;
    email: string;
    access_token: string;
}

export type UserJwtPayload = {
    user_id: number;
    user_name: string;
    user_email: string;
    user_avatar: string;
}

export type UserApi = Omit<User, 'access_token'> & {
    refresh: string;
    access: string
}

export type ApiAuthUser = {
    user: UserApi
}