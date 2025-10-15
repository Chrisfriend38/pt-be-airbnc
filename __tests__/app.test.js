const request = require("supertest");
const app = require("../app");
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
});