
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

    it("should be able to get balance", async () => {

        await request(app).post("/api/v1/users").send({
            name: "test balance", 
            email: "testbalance@test.com", 
            password: "1234"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "testbalance@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        await request(app).post("/api/v1/statements/deposit").send({
            amount: 100, 
            description: "deposito"
        }).set({
            Authorization: `Bearer ${token}`
        })

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        })



        expect(response.status).toBe(200)
        expect(response.body.statement).toHaveLength(1)
        
    })

    
    it("should not be able to get balance if user does not authenticated", async () => {

        const token = "565156145868165165156123156"

        await request(app).post("/api/v1/statements/deposit").send({
            amount: 100, 
            description: "deposito"
        }).set({
            Authorization: `Bearer ${token}`
        })

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(401)
        
    })
})
