const request = require("supertest");
const app = require("../app");
require("jest-sorted");
const seed = require("../db/seed/seed");
const {
  bookingsData,
  favouritesData,
  imagesData,
  reviewsData,
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
    reviewsData,
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
    test("200: response with requested property object when correct id entered", async () => {
      const { body } = await request(app).get("/api/properties/1").expect(200);

      expect(body.property.property_id).toBe(1);
      expect(body.property.host_id).toBe(1);
      expect(body.property.name).toBe("Modern Apartment in City Center");
      expect(body.property.location).toBe("London, UK");
      expect(body.property.property_type).toBe("Apartment");
      expect(body.property.price_per_night).toBe(120);
      expect(body.property.description).toBe(
        "Description of Modern Apartment in City Center."
      );
    });
  });
  describe("GET /api/properties?maxprice=100", () => {
    test("200: responds with an array of properties that cost less than 100", async () => {
      const { body } = await request(app)
        .get("/api/properties?maxprice=100")
        .expect(200);

      expect(Array.isArray(body.properties)).toBe(true);
      body.properties.forEach((property) => {
        expect(property.price_per_night).toBeLessThanOrEqual(100);
      });
    });
  });
  describe("GET /api/properties?maxprice=banana", () => {
    test("400: responds with an error message", async () => {
      const { body } = await request(app)
        .get("/api/properties?maxprice=banana")
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/properties?minprice=100", () => {
    test("200: responds with an array of properties that starts with a minimum price of 100", async () => {
      const { body } = await request(app)
        .get("/api/properties?minprice=100")
        .expect(200);

      expect(Array.isArray(body.properties)).toBe(true);
      body.properties.forEach((property) => {
        expect(property.price_per_night).toBeGreaterThanOrEqual(100);
      });
    });
  });
  describe("GET /api/properties?minprice=banana", () => {
    test("400: responds with an error message", async () => {
      const { body } = await request(app)
        .get("/api/properties?minprice=banana")
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/properties?minprice=100&maxprice=150", () => {
    test("200: responds with an array of properties that starts with a mininum price of 100 and a maximum price of 150", async () => {
      const { body } = await request(app)
        .get("/api/properties?minprice=100&maxprice=150")
        .expect(200);
      expect(Array.isArray(body.properties)).toBe(true);
      body.properties.forEach((property) => {
        expect(property.price_per_night).toBeGreaterThanOrEqual(100);
        expect(property.price_per_night).toBeLessThanOrEqual(150);
      });
    });
  });
  describe("POST /api/properties/api/properties/:id/reviews", () => {
    test("should respond with status of 201", async () => {
      const testReview = { guestId: 1, rating: 3, comment: "OK" };

      await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);
    });
    test("201: responds with newly inserted row", async () => {
      const testReview = { guestId: 1, rating: 3, comment: "OK" };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);

      expect(typeof body.review_id).toBe("number");
      expect(body.property_id).toBe(1);
      expect(body.guest_id).toBe(1);
      expect(body.rating).toBe(3);
      expect(body.comment).toBe("OK");
    });
    test("400: responds with an error message when guestId is not provided", async () => {
      const testReview = { rating: 3, comment: "OK" };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("400: responds with an error message when rating is not provided", async () => {
      const testReview = { guestId: 1, comment: "OK" };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("400: responds with an error message when comment is not provided", async () => {
      const testReview = { guestId: 1, rating: 3 };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("DELETE /api/properties/:id/reviews", () => {
    test("204: responds with empty body when a review is deleted", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/reviews")
        .expect(204);

      expect(body).toEqual({});
    });
    test("400: responds with an error message 'Bad Request' when ID is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/properties/not-an-id/reviews")
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/properties/:id/reviews", () => {
    test("200: responds with an array of review objects, each having the correct keys", async () => {
      const { body } = await request(app)
        .get("/api/properties/1/reviews")
        .expect(200);

      expect(Array.isArray(body.reviews)).toBe(true);

      body.reviews.forEach((review) => {
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("comment");
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("guest");
        expect(review).toHaveProperty("guest_avatar");
      });

      expect(typeof body.average_rating).toBe("number");
    });

    test("200: responds with the correct number of reviews for property 1", async () => {
      const { body } = await request(app)
        .get("/api/properties/1/reviews")
        .expect(200);

      expect(body.reviews.length).toBe(3);
    });

    test("200: responds with the correct number of reviews for property 3", async () => {
      const { body } = await request(app)
        .get("/api/properties/3/reviews")
        .expect(200);

      expect(body.reviews.length).toBe(3);
    });
    test("200: Properties should come back ordered by newest to oldest by default.", async () => {
      const { body } = await request(app)
        .get("/api/properties/5/reviews")
        .expect(200);

      expect(body.reviews).toBeSortedBy("created_at", { descending: true });
    });
    test("200: returns correct average rating and number of reviews for one singular property, i.e: property 5 (Charming Studio Retreat)", async () => {
      const { body } = await request(app)
        .get("/api/properties/5/reviews")
        .expect(200);

      expect(Array.isArray(body.reviews)).toBe(true);
      expect(body.reviews.length).toBe(2);
      expect(body.average_rating).toBe(4.5);

      //  5 | 2 | 4.50
    });
    test("404: responds with 'No reviews found for this property' when property has no reviews", async () => {
      const { body } = await request(app)
        .get("/api/properties/55000/reviews")
        .expect(404);

      expect(body.msg).toBe("Error: No reviews found for this property");
    });
    test("400: responds with an error message when id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/properties/not-a-number/reviews")
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
  });
  describe("GET /api/users/:id", () => {
  test("200: responds with the correct user object when given a valid ID", async () => {
    const { body } = await request(app)
      .get("/api/users/1")
      .expect(200);

    expect(body.user.user_id).toBe(1);
    expect(typeof body.user.first_name).toBe("string");
    expect(typeof body.user.surname).toBe("string");
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.phone_number).toBe("string");
    expect(typeof body.user.avatar).toBe("string");
    expect(typeof body.user.created_at).toBe("string");
      })
  
  test("404: responds with error message 'User not found' when given an ID that doesn’t exist", async () => {
    const { body } = await request(app)
      .get("/api/users/999999")
      .expect(404);

    expect(body.msg).toBe("Error: User not found");
  });
  test("400: responds with an error message 'Bad Request' when given an invalid ID", async () => {
    const { body } = await request(app)
      .get("/api/users/notanumber")
      .expect(400);

    expect(body.msg).toBe("Bad Request");
  });
  });
  describe("GET /api/properties?property_type=<property type>", () => {
    test("200: responds with an empty array for a property type with zero properties", async () => {
          const { body } = await request(app)
          .get("/api/properties?property_type=Villa").expect(200);
    });
    /* test("400: responds with an error message for invalid property type", async () => {
      const { body } = await request(app)
        .get("/api/properties?property_type=Pirate Ship")
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    }); */
  }); 
});

