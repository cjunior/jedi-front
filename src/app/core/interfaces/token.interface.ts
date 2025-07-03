export interface IToken {
    iss: string,
    sub: string,
    role: string,
    name: string,
    photo: string | null,
    exp: number
}