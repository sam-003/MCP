import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();
const baseURL = 'https://reqres.in/api';

// Schema definitions
const listUsersSchema = {
    type: 'object',
    properties: {
        page: { type: 'integer' },
        per_page: { type: 'integer' },
        total: { type: 'integer' },
        total_pages: { type: 'integer' },
        data: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    email: { type: 'string' },
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    avatar: { type: 'string' }
                },
                required: ['id', 'email', 'first_name', 'last_name', 'avatar']
            }
        },
        support: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                text: { type: 'string' }
            },
            required: ['url', 'text']
        }
    },
    required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support']
};

const singleUserSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                avatar: { type: 'string' }
            },
            required: ['id', 'email', 'first_name', 'last_name', 'avatar']
        },
        support: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                text: { type: 'string' }
            },
            required: ['url', 'text']
        }
    },
    required: ['data', 'support']
};

const createUserResponseSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        createdAt: { type: 'string' }
    },
    required: ['id', 'createdAt']
};

test.describe('ReqRes API Tests', () => {
    // GET Requests
    test('GET: List Users - Page 1', async ({ request }) => {
        const response = await request.get(`${baseURL}/users?page=1`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        const validate = ajv.compile(listUsersSchema);
        const isValid = validate(responseBody);
        
        expect(isValid).toBeTruthy();
        if (!isValid) console.log(validate.errors);
        
        expect(responseBody.page).toBe(1);
        expect(responseBody.data.length).toBeGreaterThan(0);
    });

    test('GET: Single User', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/2`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        const validate = ajv.compile(singleUserSchema);
        const isValid = validate(responseBody);
        
        expect(isValid).toBeTruthy();
        if (!isValid) console.log(validate.errors);
        
        expect(responseBody.data.id).toBe(2);
    });

    test('GET: User Not Found', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/23`);
        expect(response.status()).toBe(404);
    });

    // POST Requests
    test('POST: Create User', async ({ request }) => {
        const userData = {
            name: "morpheus",
            job: "leader"
        };

        const response = await request.post(`${baseURL}/users`, {
            data: userData
        });
        
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.name).toBe(userData.name);
        expect(responseBody.job).toBe(userData.job);
        expect(responseBody.id).toBeTruthy();
        expect(responseBody.createdAt).toBeTruthy();
    });

    test('POST: Register Successful', async ({ request }) => {
        const registerData = {
            email: "eve.holt@reqres.in",
            password: "pistol"
        };

        const response = await request.post(`${baseURL}/register`, {
            data: registerData
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.token).toBeTruthy();
    });

    test('POST: Register Unsuccessful', async ({ request }) => {
        const registerData = {
            email: "sydney@fife"
        };

        const response = await request.post(`${baseURL}/register`, {
            data: registerData
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error).toBe("Missing password");
    });

    // PUT Request
    test('PUT: Update User', async ({ request }) => {
        const updateData = {
            name: "morpheus",
            job: "zion resident"
        };

        const response = await request.put(`${baseURL}/users/2`, {
            data: updateData
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.name).toBe(updateData.name);
        expect(responseBody.job).toBe(updateData.job);
        expect(responseBody.updatedAt).toBeTruthy();
    });

    // PATCH Request
    test('PATCH: Update User', async ({ request }) => {
        const updateData = {
            name: "morpheus",
            job: "zion resident"
        };

        const response = await request.patch(`${baseURL}/users/2`, {
            data: updateData
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.name).toBe(updateData.name);
        expect(responseBody.job).toBe(updateData.job);
        expect(responseBody.updatedAt).toBeTruthy();
    });

    // DELETE Request
    test('DELETE: Delete User', async ({ request }) => {
        const response = await request.delete(`${baseURL}/users/2`);
        expect(response.status()).toBe(204);
    });

    // Delayed Response
    test('GET: Delayed Response', async ({ request }) => {
        const response = await request.get(`${baseURL}/users?delay=3`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        const validate = ajv.compile(listUsersSchema);
        const isValid = validate(responseBody);
        
        expect(isValid).toBeTruthy();
        if (!isValid) console.log(validate.errors);
    });
});
