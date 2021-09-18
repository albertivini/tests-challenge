import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Get Balance", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
    })

    it("should be able to get balance", async () => {

        const user = await usersRepository.create({
            email: "test@test.com",
            name: "test",
            password :"1234"
        })

        const statement1 = await statementsRepository.create({
            amount: 100,
            description: "deposito",
            type: "deposit" as OperationType,
            user_id: user.id as string,
        })

        const statement2 = await statementsRepository.create({
            amount: 50,
            description: "saque",
            type: "withdraw" as OperationType,
            user_id: user.id as string
        })

        const balance = await getBalanceUseCase.execute({user_id: user.id as string})

        expect(balance.statement).toHaveLength(2)
    })

    it("should not be able to get balance if user does not exists", async () => {

        expect(async () => {
            const user = await usersRepository.create({
                email: "test@test.com",
                name: "test",
                password :"1234"
            })
    
            const statement1 = await statementsRepository.create({
                amount: 100,
                description: "deposito",
                type: "deposit" as OperationType,
                user_id: user.id as string,
            })

            const wrongUser: string = "5156156156"
    
            await getBalanceUseCase.execute({user_id: wrongUser})

        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})