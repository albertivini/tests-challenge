import request from "supertest"
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app"

let connection: Connection

describe("Show User Profile Controller", () => {

    beforeAll(async () => {

        connection = await createConnection()
        await connection.runMigrations()

    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("should be able to show the user profile", async () => {

        await request(app)
        .post("/api/v1/users")
        .send({
            name: "Testando", 
            email: "test123@test.com", 
            password: "1234"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test123@test.com",
            password: "1234"
        })

        const { token } = responseToken.body

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(200)

    })

    
    it("should not be able to show the user profile if user does not authenticated ", async () => {

        const token = "516512315613212314561616"

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(401)

    })
})