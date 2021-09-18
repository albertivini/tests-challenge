
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

    it("should be able to get a statement operation", async () => {

        await request(app).post("/api/v1/users").send({
            name: "test operation", 
            email: "testoperation@test.com", 
            password: "1234"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "testoperation@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100, 
            description: "deposito"
        }).set({
            Authorization: `Bearer ${token}`
        })

        const responseOperation = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
            Authorization: `Bearer ${token}`
        })

        expect(responseOperation.status).toBe(200)
    })

    it("should not be able to get a statement operation if statement id is wrong", async () => {

        await request(app).post("/api/v1/users").send({
            name: "test operation", 
            email: "testoperation@test.com", 
            password: "1234"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "testoperation@test.com", 
            password: "1234"        
        })

        const { token } = responseToken.body

        const wrongStatement = "0e23d1bc-010a-43f2-963a-9134e10ecd5e"

        const responseOperation = await request(app).get(`/api/v1/statements/${wrongStatement}`).set({
            Authorization: `Bearer ${token}`
        })

        expect(responseOperation.status).toBe(404)
    })

})