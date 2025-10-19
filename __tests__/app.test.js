const request = require("supertest");
const app = require("../app");
require("jest-sorted");
const seed = require("../db/seed/seed");
const {
  bookingsData,
  favouritesData,
  imagesData,
  propertiesData,
  propertyTypesData,
  usersData,
} = require("../db/data/test/index");
const db = require("../db/connection");

beforeEach(async () => {
  await seed(
    usersData,
    propertyTypesData,
    propertiesData,
    [],
    imagesData,
    favouritesData,
    bookingsData
  );
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  test("404: Invalid Route - Path not found", async () => {
    const { body } = await request(app).get("/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found.");
  });

  describe("GET /api/properties", () => {
    test("200: responds with an array of properties", async () => {
      const { body } = await request(app).get("/api/properties").expect(200);

      const propertiesIsArray = Array.isArray(body.properties);
      expect(propertiesIsArray).toBe(true);
      expect(body.properties.length).toBeGreaterThanOrEqual(1);
      body.properties.forEach((property) => {
        expect(typeof property.property_id).toBe("number");
        expect(typeof property.name).toBe("string");
        expect(typeof property.location).toBe("string");
        expect(typeof property.price_per_night).toBe("number");
        expect(typeof property.host_id).toBe("number");
      });
    });

    test("404: Invalid Route - Path not found for invalid route", async () => {
      const { body } = await request(app).get("/invalid/path").expect(404);
      expect(body.msg).toBe("Path not found.");
    });
  });

  describe("GET /api/properties?order=ascending", () => {
    test("200: responds with an array of properties sorted by price from lowest to highest by default", async () => {
      const { body } = await request(app)
        .get("/api/properties?order=ascending")
        .expect(200);
      expect(Array.isArray(body.properties)).toBe(true);

      expect(body.properties.length).toBeGreaterThan(0);

      expect(body.properties).toBeSortedBy("price_per_night", {
        ascending: true,
      });
    });
  });
  describe("GET /api/properties?order=descending", () => {
    test("200: Can accept order query when changed order to descending", async () => {
      const { body } = await request(app)
        .get("/api/properties?order=descending")
        .expect(200);

      expect(body.properties).toBeSortedBy("price_per_night", {
        descending: true,
      });
    });
  });
  describe("GET /api/properties?order=banana", () => {
    test("400: responds with an error message for invalid order query", async () => {
      const { body } = await request(app)
        .get("/api/properties?order=banana")
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/properties/:id (single property)", () => {
    test("404: responds with 'Property not found' when incorrect id entered", async () => {
      const { body } = await request(app)
        .get("/api/properties/9999999")
        .expect(404);

      expect(body.msg).toBe("Error: Property not found");
    });
    test("400: responds with 'Bad Request' when id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/properties/not-an-id")
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("200: response returns an object with the requested property key", async () => {
      const { body } = await request(app).get("/api/properties/1").expect(200);

      expect(body).toHaveProperty("property");
      expect(typeof body.property).toBe("object");
    });
  });
});
