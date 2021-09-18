import request from "supertest"
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app"

let connection: Connection

describe("Authenticate User Controller", () => {

    beforeAll(async () => {

        connection = await createConnection()

        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("should be able to authenticate an user", async () => {

        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Test5", 
                email: "test5@test.com", 
                password: "1234"
            })

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test5@test.com",
            password: "1234"
        })

        expect(response.status).toBe(200)
    }) 

    it("should not be able to authenticate an user email does not exists", async () => {

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test2@test.com",
            password: "1234"
        })

        expect(response.status).toBe(401)
    }) 

    it("should not be able to authenticate an user password is incorrect", async () => {

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test5@test.com",
            password: "12345"
        })

        expect(response.status).toBe(401)
    }) 
})