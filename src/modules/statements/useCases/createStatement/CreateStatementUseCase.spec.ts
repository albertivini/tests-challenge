import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository

describe("Create Statement", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository)
    })

    it("should be able to create a new deposit statement", async () => {

        const user = await usersRepositoryInMemory.create({
            email: "test@test.com",
            name: "test@test.com",
            password: "test@test.com"
        })

        const operation = await createStatementUseCase.execute({ amount: 100, description: "deposit", type: "deposit" as OperationType, user_id: user.id as string })

        expect(operation).toHaveProperty("id")
        expect(operation.amount).toBe(100)
        expect(operation.type).toBe("deposit")
    })


    it("should be able to create a new withdraw statement", async () => {

        const user = await usersRepositoryInMemory.create({
            email: "test@test.com",
            name: "test@test.com",
            password: "test@test.com"
        })

        await statementsRepository.create({
            amount: 100, description: "deposit", type: "deposit" as OperationType, user_id: user.id as string
        })

        const operation = await createStatementUseCase.execute({ amount: 80, description: "withdraw", type: "withdraw" as OperationType, user_id: user.id as string })

        expect(operation).toHaveProperty("id")
        expect(operation.amount).toBe(80)
        expect(operation.type).toBe("withdraw")
    })

    it("should not be able to create a new withdraw/deposit statement if user does not exists ", async () => {

        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                email: "test@test.com",
                name: "test@test.com",
                password: "test@test.com"
            })
    
            const wrongUser = "165156123158"
    
            await createStatementUseCase.execute({ amount: 80, description: "withdraw", type: "withdraw" as OperationType, user_id: wrongUser })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

    })

    it("should not be able to create a new withdraw statement if user have insuficient founds ", async () => {

        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                email: "test@test.com",
                name: "test@test.com",
                password: "test@test.com"
            })
    
            await statementsRepository.create({
                amount: 100, description: "deposit", type: "deposit" as OperationType, user_id: user.id as string
            })
    
            await createStatementUseCase.execute({ amount: 150, description: "withdraw", type: "withdraw" as OperationType, user_id: user.id as string })


        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

    })
})