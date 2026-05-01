import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("GET /posts", () => {
  let response;

  beforeAll(async () => {
    response = await axios.get(`${BASE_URL}/posts`);
  });

  test("should return status code 200", () => {
    expect(response.status).toBe(200);
  });

  test("should return an array of posts", () => {
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("should return non-empty list of posts", () => {
    expect(response.data.length).toBeGreaterThan(0);
  });
});

describe("GET /posts/1", () => {
  let response;

  beforeAll(async () => {
    response = await axios.get(`${BASE_URL}/posts/1`);
  });

  test("should return status code 200", () => {
    expect(response.status).toBe(200);
  });

  test("should return post with id 1", () => {
    expect(response.data.id).toBe(1);
  });

  test("should contain required post fields", () => {
    expect(response.data).toHaveProperty("userId");
    expect(response.data).toHaveProperty("id");
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("body");
  });
});

describe("POST /posts", () => {
  let response;

  beforeAll(async () => {
    response = await axios.post(`${BASE_URL}/posts`, {
      title: "Test book review",
      body: "This is a test post created during integration testing.",
      userId: 1,
    });
  });

  test("should return status code 201", () => {
    expect(response.status).toBe(201);
  });

  test("should return created post title", () => {
    expect(response.data.title).toBe("Test book review");
  });

  test("should return created post body", () => {
    expect(response.data.body).toBe(
      "This is a test post created during integration testing.",
    );
  });

  test("should return created post userId", () => {
    expect(response.data.userId).toBe(1);
  });
});

describe("PUT /posts/1", () => {
  let response;

  beforeAll(async () => {
    response = await axios.put(`${BASE_URL}/posts/1`, {
      id: 1,
      title: "Updated test book review",
      body: "This post was updated during integration testing.",
      userId: 1,
    });
  });

  test("should return status code 200", () => {
    expect(response.status).toBe(200);
  });

  test("should return updated title", () => {
    expect(response.data.title).toBe("Updated test book review");
  });

  test("should return updated body", () => {
    expect(response.data.body).toBe(
      "This post was updated during integration testing.",
    );
  });

  test("should keep post id equal to 1", () => {
    expect(response.data.id).toBe(1);
  });
});

describe("DELETE /posts/1", () => {
  let response;

  beforeAll(async () => {
    response = await axios.delete(`${BASE_URL}/posts/1`);
  });

  test("should return status code 200", () => {
    expect(response.status).toBe(200);
  });

  test("should return empty object after deleting post", () => {
    expect(response.data).toEqual({});
  });
});
