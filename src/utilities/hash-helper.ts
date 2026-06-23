import bcrypt from "bcrypt";


export const createHash = async (data: string ): Promise<string> => {
    return await bcrypt.hash(data, 10);
}

export const verifyHash = async (data: string, hashedData: string): Promise<boolean> => {
    return await bcrypt.compare(data, hashedData)
}