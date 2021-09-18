import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get Statement Operation", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository)
    })

    it("should be able to get a statement operation", async () => {

        const user = await usersRepository.create({
            email: "test@test.com",
            name: "test",
            password :"1234"
        })

        const statement = await statementsRepository.create({
            amount: 100,
            description: "saque",
            type: "deposit" as OperationType,
            user_id: user.id as string,
        })

        const statementOperation = await getStatementOperationUseCase.execute({
            statement_id: statement.id as string,
            user_id: user.id as string
        })

        expect(statementOperation.amount).toBe(100)
        expect(statementOperation.type).toBe("deposit")
        
    })

    it("should not be able to get a statement operation if user does not exists ", async () => {
        expect(async () => {
            const user = await usersRepository.create({
                email: "test@test.com",
                name: "test",
                password :"1234"
            })
    
            const statement = await statementsRepository.create({
                amount: 100,
                description: "saque",
                type: "deposit" as OperationType,
                user_id: user.id as string,
            })
    
            const wrongUser = "12341561651"
    
            await getStatementOperationUseCase.execute({
                statement_id: statement.id as string,
                user_id: wrongUser
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("should not be able to get a statement operation if statement does not exists ", async () => {
        expect(async () => {
            const user = await usersRepository.create({
                email: "test@test.com",
                name: "test",
                password :"1234"
            })
    
            const statement = await statementsRepository.create({
                amount: 100,
                description: "saque",
                type: "deposit" as OperationType,
                user_id: user.id as string,
            })
    
            const wrongStatement = "534523412312"
    
            await getStatementOperationUseCase.execute({
                statement_id: wrongStatement,
                user_id: user.id as string
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})