
export interface CreateClientInput{

    name: string;
    email: string;
    phone: string;

}

export interface Client extends CreateClientInput{
    clientId: number;
    createdAt: Date;
}