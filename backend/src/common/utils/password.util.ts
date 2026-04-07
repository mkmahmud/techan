import * as bcrypt from 'bcryptjs'

const DEFAULT_BCRYPT_ROUNDS = 12
const DUMMY_PASSWORD_INPUT = 'invalid-password-input'

const dummyHashCache = new Map<number, string>()

export async function hashPassword(password: string, rounds = DEFAULT_BCRYPT_ROUNDS) {
    return bcrypt.hash(password, rounds)
}

export async function comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
}

export async function getDummyPasswordHash(rounds = DEFAULT_BCRYPT_ROUNDS) {
    const cachedHash = dummyHashCache.get(rounds)
    if (cachedHash) return cachedHash

    const generatedHash = await hashPassword(DUMMY_PASSWORD_INPUT, rounds)
    dummyHashCache.set(rounds, generatedHash)
    return generatedHash
}
