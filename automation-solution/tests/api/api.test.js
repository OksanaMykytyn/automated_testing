const axios = require("axios");

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("API tests", () => {
  test("GET /posts should return status code 200", async () => {
    const response = await axios.get(`${BASE_URL}/posts`);

    expect(response.status).toBe(200);
  });

  test("GET /posts should return an array", async () => {
    const response = await axios.get(`${BASE_URL}/posts`);

    expect(Array.isArray(response.data)).toBe(true);
  });

  test("GET /posts/1 should return post with id 1", async () => {
    const response = await axios.get(`${BASE_URL}/posts/1`);

    expect(response.data.id).toBe(1);
  });

  test("POST /posts should create a new post", async () => {
    const response = await axios.post(`${BASE_URL}/posts`, {
      title: "Vivat test post",
      body: "Automation solution API test",
      userId: 1,
    });

    expect(response.status).toBe(201);
    expect(response.data.title).toBe("Vivat test post");
  });

  test("DELETE /posts/1 should return status code 200", async () => {
    const response = await axios.delete(`${BASE_URL}/posts/1`);

    expect(response.status).toBe(200);
  });
});
