import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
    })

    it("should be able to show an user profle", async () => {

        const user = await usersRepository.create({
            email: "test@test.com",
            name: "test",
            password: "1234"
        })

        const profile = await showUserProfileUseCase.execute(user.id as string)

        expect(profile).toBe(user)
    })

    it("should be able to show an user profle", async () => {

        expect(async () => {
            const user = await usersRepository.create({
                email: "test@test.com",
                name: "test",
                password: "1234"
            })

            const wrongId: string = "123456"
    
            await showUserProfileUseCase.execute(wrongId)
        }).rejects.toBeInstanceOf(ShowUserProfileError)


    })

})