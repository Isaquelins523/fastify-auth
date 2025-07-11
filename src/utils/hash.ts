import { compare, hash } from "bcryptjs";

export async function hashedPassword(password:string): Promise<string> {
    return hash(password, 10)
}

export async function verifyPassword(password:string, hash : string): Promise<Boolean> {
    return compare(password, hash)
}