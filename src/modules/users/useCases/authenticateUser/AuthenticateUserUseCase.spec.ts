import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


let usersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
        createUserUseCase = new CreateUserUseCase(usersRepository)
    })

    it ("should be able to authenticate a user", async () => {

        await createUserUseCase.execute({
            email: "test@test.com",
            name: "test",
            password: "1234"
        })

        const response = await authenticateUserUseCase.execute({email: "test@test.com", password: "1234"})

        expect(response).toHaveProperty("token")

    })

    it ("should not be able to authenticate a user with wrong email", async () => {

        expect(async () => {
            const user = {
                email: "test@test.com",
                name: "test",
                password: "1234"
            }
    
            await createUserUseCase.execute({
                email: "test@test.com",
                name: "test",
                password: "1234"
            })
    
            await authenticateUserUseCase.execute({email: "tessst@test.com", password: "1234"})
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it ("should not be able to authenticate a user with wrong password", async () => {

        expect(async () => {
            const user = {
                email: "test@test.com",
                name: "test",
                password: "1234"
            }
    
            await createUserUseCase.execute({
                email: "test@test.com",
                name: "test",
                password: "1234"
            })
    
            await authenticateUserUseCase.execute({email: "test@test.com", password: "12345"})
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})