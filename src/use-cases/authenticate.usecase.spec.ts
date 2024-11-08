import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate.usecase';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error';


describe('Authenticate Use Case', () => {

    let repository: InMemoryUserRepository;
    let sut: AuthenticateUseCase;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
        sut = new AuthenticateUseCase(repository)
    })

    it('should be able to authenticate', async () => {
        await repository.create({ name: 'John Doe', email: 'KX7Jt@example.com', password_hash: await hash('123456', 6) })
        const user = await sut.execute({
            email: 'KX7Jt@example.com',
            password: '123456'
        }).then(res => res.user)

        expect(user.id).toEqual(expect.any(String))
    })


    it('should not be able to authenticate with wrong email', async () => {
        await expect(() => sut.execute({
            email: 't@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await repository.create({ name: 'John Doe', email: 'KX7Jt@example.com', password_hash: await hash('123456', 6) })
        await expect(() => sut.execute({
            email: 't@example.com',
            password: '12356'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })


})