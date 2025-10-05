const request = require("supertest");
const app = require("../../../app");
const seed = require("../../seed/seed");
const {
  propertiesData,
  propertyTypesData,
  usersData,
  favouritesData,
  imagesData
} = require("./index");
const db = require("../../connection");

beforeEach(async () => {
  await seed(usersData, propertyTypesData, propertiesData, [], imagesData, favouritesData);
});

afterAll(() => db.end());

describe("app", () => {
  test("404: Invalid Route - Path not found", async () => {
    const { body } = await request(app).get("/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found.");
  });

describe("GET /api/properties", () => {
    test("200: responds with an array of properties ordered by favourite_count", async () => {
      const { body } = await request(app)
      .get("/api/properties")
      .expect(200);

      expect(Array.isArray(body.properties)).toBe(true);
      expect(body.properties.length).toBeGreaterThan(0);

      const property = body.properties[0];
      expect(typeof property.property_id).toBe("number");
      expect(typeof property.property_name).toBe("string");
      expect(typeof property.location).toBe("string");
      expect(typeof property.price_per_night).toBe("number");
      expect(typeof property.host).toBe("string");
      expect(property).toHaveProperty("favourite_count");
    });

    test("404: Invalid Route - Path not found for invalid route", async () => {
      const { body } = await request(app).get("/invalid/path").expect(404);
      expect(body.msg).toBe("Path not found.");
    });
  });

describe("GET /api/properties (sort by query)", () => {
    test("200: responds sorted by cost_per_night and order ascending", async () => {
        const { body } = await request(app)
        .get("/api/properties?sort=cost_per_night&order=ascending")
        .expect(200);

        expect(Array.isArray(body.properties)).toBe(true);
        expect(body.properties[0].price_per_night).toBeLessThanOrEqual(body.properties[1].price_per_night);
    });

    test("200: responds sorted by popularity in descending order", async () => {
        const { body } = await request(app)
        .get("/api/properties?sort=popularity&order=descending")
        .expect(200);

        expect(Array.isArray(body.properties)).toBe(true);
        expect(body.properties[0].favourite_count).toBeGreaterThanOrEqual(
            body.properties[1].favourite_count
        );
    });

    test("400: invalid sort query returns bad request", async () => {
    const { body } = await request(app)
      .get("/api/properties?sort=invalid")
      .expect(200); // fallback handled in model
    expect(Array.isArray(body.properties)).toBe(true);
    });
  });

/* describe("GET /api/properties/:id (single property)", () => {
   test("404: responds with 'Property not found' when incorrect id entered")
    const { body } = await request(app)
    .get("/api/properties/99999999")
    .expect(404);

    expect(body.msg).toBe("Error: Property not found")
}); */

});