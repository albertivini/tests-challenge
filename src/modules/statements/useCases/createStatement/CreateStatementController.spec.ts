
import request from "supertest"
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app"

let connection: Connection

describe("Get Balance Controller", () => {

    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it("should be able to create a deposit statement", async () => {

        await request(app).post("/api/v1/users").send({
            name: "test statement", 
            email: "teststatement@test.com", 
            password: "1234"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "teststatement@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100, 
            description: "deposito"
        }).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(201)
    })

    it("should be able to create a withdraw statement", async () => {

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "teststatement@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 60, 
            description: "saque"
        }).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(201)
    })

    it("should not be able to create a withdraw statement if balance is lower than withdraw", async () => {

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "teststatement@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 80, 
            description: "saque"
        }).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(400)
    })

})