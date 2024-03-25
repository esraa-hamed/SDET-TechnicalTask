const supertest = require("supertest");
const app = require("./app.js");
const db = require('./db.js');

describe("POST /users", ()=>{

    describe("Given a name, valid email and password", ()=>{
       
        //should specify json in the content type header
        test("Should specify json in the content type header", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({
                name: "user1",
                email: "user1@gmail.com",
                password:"user123" 
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        })

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({
                name: "user2",
                email: "user2@gmail.com",
                password:"user123" 
            })
            expect(response.statusCode).toBe(200);
        })

        //response body should contain the expected success message 
        test("Response body should contain the expected success message ", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({
                name: "user3",
                email: "user3@gmail.com",
                password:"user123" 
            })
            expect(response.body).toEqual({
                message: "User registered with success"
            });
        })

        //should actually save name, email and password in the database
        test("Should actually save name, email and password in the database", async ()=>{
            const userData = {
                name: "user4",
                email: "user4@gmail.com",
                password:"user123" 
            };
            const response = await supertest(app).post("/api/v1/users").send(userData);
            const savedUser = await db.findUserByEmail(userData.email);
            expect(savedUser.name).toEqual(userData.name);
            expect(savedUser.email).toEqual(userData.email);
            expect(savedUser.password).toEqual(userData.password);
        })

    })

    describe("Trying to register a new user with same email as one already registered", ()=>{

        //should respond with an error status code [401 (Unauthorized) or 403 (Forbidden)]
        test("Should respond with a status code of either 401 or 403", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({
                name: "user1",
                email: "user1@gmail.com",
                password:"user123" 
            })
            expect([401, 403]).toContain(response.statusCode);
        })

        //response body should contain the expected failure message 
        test("Response body should contain the expected failure message ", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({
                name: "user1",
                email: "user1@gmail.com",
                password:"user123" 
            })
            expect(response.body).toEqual({
                message: "User already registered"
            });
        })

        //should NOT save them in the database
        test("Should NOT save that user's informarion in the database", async ()=>{
            const userData = {
                name: "user1",
                email: "user1@gmail.com",
                password:"user123" 
            };
            const allUsers = await db.readUsersFromFile();
            const usersWithSameEmail = allUsers.filter( (user) => user.email === userData.email);
            expect(usersWithSameEmail.length).toBe(1);
        })

    })

    describe("When the email and password are missing", ()=>{

        //perform setup before running the tests
        let dataLengthBeforeRequest;
        beforeAll(async () => {
            const allUsersBefore = await db.readUsersFromFile();
            dataLengthBeforeRequest = allUsersBefore.length;
        });

        //should respond with a status code of 400
        test("Should respond with a status code of 400", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({});
            expect(response.statusCode).toBe(400);
        })

        //should NOT save empty {} in the database
        test("Should NOT save empty {} in the database", async ()=>{
            const response = await supertest(app).post("/api/v1/users").send({});
            const allUsersAfter = await db.readUsersFromFile();
            const dataLengthAfterRequest = allUsersAfter.length;
            expect(dataLengthAfterRequest).toEqual(dataLengthBeforeRequest);
        })

    })

    describe("Given an invalid email", ()=>{

        //perform setup before running the tests
        let dataLengthBeforeRequest;
        beforeAll(async () => {
            const allUsersBefore = await db.readUsersFromFile();
            dataLengthBeforeRequest = allUsersBefore.length;
        });

        //should respond with an error status code of 400
        test("Should respond with a status code of 400", async ()=>{
            const userInvalidData = {
                name: "user5",
                email: "invalidemail",
                password:"user123" 
            };
            const response = await supertest(app).post("/api/v1/users").send(userInvalidData)
            expect(response.statusCode).toBe(400);
        })

        //should NOT save it in the database
        test("Should NOT save it in the database", async ()=>{
            const userInvalidData = {
                name: "user5",
                email: "invalidemail",
                password:"user123" 
            };
            const response = await supertest(app).post("/api/v1/users").send(userInvalidData);
            const allUsersAfter = await db.readUsersFromFile();
            const dataLengthAfterRequest = allUsersAfter.length;
            expect(dataLengthAfterRequest).toEqual(dataLengthBeforeRequest);
        })

    })

    describe("Given a weak password", ()=>{

        //perform setup before running the tests
        let dataLengthBeforeRequest;
        beforeAll(async () => {
            const allUsersBefore = await db.readUsersFromFile();
            dataLengthBeforeRequest = allUsersBefore.length;
        });

        //should NOT save it in the database
        test("Should NOT save it in the database", async ()=>{
            const userInvalidData = {
                name: "user7",
                email: "user7@gmail.com",
                password:"weakpass" 
            };
            const response = await supertest(app).post("/api/v1/users").send(userInvalidData);
            const allUsersAfter = await db.readUsersFromFile();
            const dataLengthAfterRequest = allUsersAfter.length;
            expect(dataLengthAfterRequest).toEqual(dataLengthBeforeRequest);
        })

        //should respond with an error status code of 400
        test("Should respond with a status code of 400", async ()=>{
            const userInvalidData = {
                name: "user6",
                email: "user6@gmail.com",
                password:"weakpass" 
            };
            const response = await supertest(app).post("/api/v1/users").send(userInvalidData)
            expect(response.statusCode).toBe(400);
        })

    })
})

// ------------------------------------------------------------------------------------------------ //

describe("POST /auth", ()=>{

    describe("Given valid credentials of a regiestered user", ()=>{

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com",
                password:"user123" 
            })
            expect(response.statusCode).toBe(200);
        })

        //response body should contain user token
        test("Response body should contain a valid user token", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com",
                password:"user123"
            })
            expect(response.body).toHaveProperty("token");
            expect(typeof response.body.token).toBe("string");
            expect(response.body.token).not.toBe('');
        })

    })

    describe("Given INVALID credentials (incorrect password) of a user", ()=>{

        //should respond with a status code of 401
        test("Should respond with a status code of 401", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com",
                password:"incorrectpass" 
            })
            expect(response.statusCode).toBe(401);
        })

        //response body should  contain the expected failure message 
        test("Response body should contain the expected failure message", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com",
                password:"incorrectpass"
            })
            expect(response.body).toEqual({
                message: "Incorrect email or password"
            });
        })
    })

    describe("Given INVALID credentials (incorrect email/ unregistered email) of a user", ()=>{

        //should respond with a status code of 401
        test("Should respond with a status code of 401", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "incorrectemail",
                password:"incorrectpass" 
            })
            expect(response.statusCode).toBe(401);
        })

        //response body should  contain the expected failure message 
        test("Response body should contain the expected failure message", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "incorrectemail",
                password:"incorrectpass"
            })
            expect(response.body).toEqual({
                message: "Incorrect email or password"
            });
        })
    })

    describe("Given MISSING credentials (missing password) of a user", ()=>{

        //should respond with a status code of 401
        test("Should respond with a status code of 401", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com"
            })
            expect(response.statusCode).toBe(401);
        })

        //response body should  contain the expected failure message 
        test("Response body should contain the expected failure message", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                email: "user1@gmail.com"
            })
            expect(response.body).toEqual({
                message: "Incorrect email or password"
            });
        })
    })

    describe("Given MISSING credentials (missing email) of a user", ()=>{

        //should respond with a status code of 401
        test("Should respond with a status code of 401", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                password: "user123" 
            })
            expect(response.statusCode).toBe(401);
        })

        //response body should contain the expected failure message 
        test("Response body should contain the expected failure message", async ()=>{
            const response = await supertest(app).post("/api/v1/auth").send({
                password: "user123" 
            })
            expect(response.body).toEqual({
                message: "Incorrect email or password"
            });
        })

    })

})

// ------------------------------------------------------------------------------------------------ //

describe("GET /users", ()=>{

    describe("Basic retrieval of users", ()=>{

        //should retrieve all users found in the database
        test("Should retrieve all users' information", async ()=>{
            const allUsersBefore = await db.readUsersFromFile();
            const dataLengthBeforeRequest = allUsersBefore.length;
            const response = await supertest(app).get("/api/v1/users");
            expect(response.body).toStrictEqual(allUsersBefore);
        })

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const response = await supertest(app).get("/api/v1/users");
            expect(response.statusCode).toBe(200);
        })

    })

    describe("Given a user token", ()=>{

        //should retrieve all user's information
        test("Should retrieve all user's information", async ()=>{
            const userData = {
                email: "user1@gmail.com",
                password:"user123"
            };
            const savedUser = await db.findUserByEmail(userData.email);
            const res = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = res.body.token;
            const response = await supertest(app).get("/api/v1/users").set('Authorization', `${userToken}`);
            expect(response.body).toStrictEqual(savedUser);
        })

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const userData = {
                email: "user1@gmail.com",
                password:"user123"
            };
            const res = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = res.body.token;
            const response = await supertest(app).get("/api/v1/users").set('Authorization', `${userToken}`);
            expect(response.statusCode).toBe(200);
        })

    })

    describe("Given INVALID token", ()=>{

        //response body should contain the expected failure message 
        test("Response body should contain the expected failure message", async ()=>{
            const invalidToken = "invalidtoken";
            const response = await supertest(app).get("/api/v1/users").set('Authorization', invalidToken);
            expect(response.body).toEqual({
                message: "Unauthorized"
            });
        })

        //should respond with an error status code [401 (Unauthorized) or 403 (Forbidden)]
        test("Should respond with an error status code", async ()=>{
            const invalidToken = "invalidtoken";
            const response = await supertest(app).get("/api/v1/users").set('Authorization', invalidToken);
            expect([401, 403]).toContain(response.statusCode);
        })

    })

})

// ------------------------------------------------------------------------------------------------ //

describe("PATCH /users", ()=>{
    
    describe("Given a user token, and the updated data", ()=>{

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const userData = {
                email: "user3@gmail.com",
                password: "user123",
            };
            const updatedData = {
                email: "user3@gmail.com",
                password: "updatedpass",
            }
            const res = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = res.body.token;
            const response = await supertest(app).patch("/api/v1/users").set('Authorization', `${userToken}`).send(updatedData);
            expect(response.statusCode).toBe(200);
        })

        //should actually update the user information in the database
        test("Should actually update the user information in the database", async ()=>{
            const initialData = {
                email: "user1@gmail.com",
                password: "user123",
            };
            const user = await db.findUserByEmail(initialData.email);
            const userID = user.id;
            const updatedData = {
                email: "user1@gmail.com",
                password: "updatedpass",
            }
            const res = await supertest(app).post("/api/v1/auth").send(initialData);
            const userToken = res.body.token;
            const response = await supertest(app).patch("/api/v1/users").set('Authorization', `${userToken}`).send(updatedData);
            const userAfterUpdate = await db.findUserByID(userID);
            expect(userAfterUpdate.password).toEqual(updatedData.password);
        })

        //response body should contain expected success message
        test("Response body should contain expected success message", async ()=>{
            const initialData = {
                email: "user2@gmail.com",
                password: "user123",
            };
            const user = await db.findUserByEmail(initialData.email);
            const userID = user.id;
            const updatedData = {
                email: "user2@gmail.com",
                password: "updatedpass",
            }
            const res = await supertest(app).post("/api/v1/auth").send(initialData);
            const userToken = res.body.token;
            const response = await supertest(app).patch("/api/v1/users").set('Authorization', `${userToken}`).send(updatedData);
            expect(response.body.message).toBe('User updated with success!');
        })
        
    })

    describe("Given a user token, and INVALID updated data (duplicate emails)", ()=>{

        //should respond with an error status code [401 (Unauthorized) or 403 (Forbidden)]
        test("Should respond with a status code of either 401 or 403", async ()=>{
            const userData = {
                email: "user1@gmail.com",
                password: "user123",
            };
            const updatedData = {
                email: "user2@gmail.com",
                password: "user123",
            }
            const res = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = res.body.token;
            const response = await supertest(app).patch("/api/v1/users").set('Authorization', `${userToken}`).send(updatedData);
            expect([401, 403]).toContain(response.statusCode);
        })

        //should NOT update the data in the database
        test("Should NOT update the data in the database", async ()=>{
            const initialData = {
                email: "user1@gmail.com",
                password: "user123",
            };
            const user = await db.findUserByEmail(initialData.email);
            const userID = user.id;
            const updatedData = {
                email: "user2@gmail.com",
                password: "user123",
            }
            const res = await supertest(app).post("/api/v1/auth").send(initialData);
            const userToken = res.body.token;
            const response = await supertest(app).patch("/api/v1/users").set('Authorization', `${userToken}`).send(updatedData);
            const userAfterUpdate = await db.findUserByID(userID);
            expect(userAfterUpdate.email).toEqual(initialData.email);
        })

    })

})

// ------------------------------------------------------------------------------------------------ //

describe("DELETE /users", ()=>{

    let tokenOfDeletedUser;

    describe("Given a user token", ()=>{

        //should respond with a status code of 200
        test("Should respond with a status code of 200", async ()=>{
            const userData = {
                email: "ehamed@gmail.com",
                password: "epass",
            };
            const addUserResponse = await supertest(app).post("/api/v1/users").send(userData);
            const authenticationResponse = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = authenticationResponse.body.token;
            const response = await supertest(app).delete("/api/v1/users").set('Authorization', `${userToken}`);
            expect(response.statusCode).toBe(200);
        })

        //response body should contain the expected success message
        test("Response body should contain the expected success message", async ()=>{
            const userData = {
                email: "ehamed@gmail.com",
                password: "epass",
            };
            const addUserResponse = await supertest(app).post("/api/v1/users").send(userData);
            const authenticationResponse = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = authenticationResponse.body.token;
            const response = await supertest(app).delete("/api/v1/users").set('Authorization', `${userToken}`);
            console.log("DELETE Response:", response.body);
            expect(response.body).toEqual({
                message: 'User deleted with success!'
            })
        })

        //user should actually be deleted from the database
        test("User should actually be deleted from the database", async ()=>{
            const userData = {
                email: "ehamed@gmail.com",
                password: "epass",
            };
            const addUserResponse = await supertest(app).post("/api/v1/users").send(userData);
            const authenticationResponse = await supertest(app).post("/api/v1/auth").send(userData);
            const userToken = authenticationResponse.body.token;
            const response = await supertest(app).delete("/api/v1/users").set('Authorization', `${userToken}`);
            const deletedUser = await db.findUserByEmail(userData.email);
            tokenOfDeletedUser = userToken;
            expect(deletedUser).toBeUndefined();
        })

    })

    describe("On trying to delete an already deleted user", ()=>{

        //should respond with a status code of 403
        test("Should respond with a status code of 403", async ()=>{
            const userData = {
                email: "ehamed@gmail.com",
                password: "epass",
            };
            const response = await supertest(app).delete("/api/v1/users").set('Authorization', tokenOfDeletedUser);
            expect(response.statusCode).toBe(403);
        })

    })

})

// ------------------------------------------------------------------------------------------------ //

describe("DELETE /all-users", ()=>{

    describe("Given the key admin", ()=>{

        //should delete ALL users
        //should respond with a status code of 200
        //should send expected success message in response body
        test("Should delete ALL users, respond with status code 200, send expected success message", async ()=>{
            const keyAdminBody = {
                key_admin: "keyadmin123"
            };
            const response = await supertest(app).delete("/api/v1/all-users").send(keyAdminBody);
            const allUsers = await db.readUsersFromFile();
            const dataLength = allUsers.length;
            expect(response.statusCode).toBe(200);
            expect(dataLength).toBe(0);
            expect(response.body).toEqual({
                message: "Users deleted with success"
            });
        })

    })

})

// ------------------------------------------------------------------------------------------------ //