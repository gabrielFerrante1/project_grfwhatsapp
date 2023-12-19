export type ContactInfo = {
    id: number;
    avatar: string;
    name: string;
    email: string;
    blocked: boolean
}

export type ApiGetContactInfo = {
    contact: ContactInfo
}