const { createUserRef, createPropertyRef, createImagesRef} = require("../db/utils/utils.js");


describe("createUserRef", () => {
    test("returns an empty object when passed an empty array", () => {
        expect(createUserRef([])).toEqual({});
    });
    test("references each full name with a user_id number", () => {
        const input = [
            { first_name: "Alice", surname: "Johnson" },
            { first_name: "Bob", surname: "Smith" },
            { first_name: "Emma", surname: "Davis" }
        ];
        const output = {
            "Alice Johnson": 1,
            "Bob Smith": 2,
            "Emma Davis": 3
        };

        expect(createUserRef(input)).toEqual(output);
    });
});

describe("createPropertyRef", () => {
    test("returns an empty object when passed an empty array", () => {
        expect(createPropertyRef([])).toEqual({});
    });
    test("return a reference object for a singular property", () => {
        const input = [
            { property_id: 1, name: "Modern Apartment in City Center" }
        ];
        const output = {
            "Modern Apartment in City Center": 1
        };

        expect(createPropertyRef(input)).toEqual(output);
    });
    test("return a reference object for multiple properties", () => {
        const input = [
            { property_id: 1, name: "Modern Apartment in City Center" },
            { property_id: 2, name: "Cosy Family House" },
            { property_id: 3, name: "Chic Studio Near the Beach" }
        ];
        const output = {
            "Modern Apartment in City Center": 1,
            "Cosy Family House": 2,
            "Chic Studio Near the Beach": 3
        };

        expect(createPropertyRef(input)).toEqual(output);
    });
        


});

describe("createImagesRef", () => {
    test("returns an empty object when passed an empty array", () => {
        expect(createImagesRef([])).toEqual({});
    }); 
    test("references singular images property_name with a property_id number", () => {
        const input = [
            { property_name: "Modern Apartment in City Center", image_url: "url1", alt_tag: "tag1" },
        ];
        const propertyRef= { "Modern Apartment in City Center": 1 };
        const output = { "Modern Apartment in City Center": 1 };
    
        expect(createImagesRef(input, propertyRef)).toEqual(output);
    });
    test("references multiple images property_name with a property_id number", () => {
        const input = [
            { property_name: "Modern Apartment in City Center", image_url: "url1", alt_tag: "tag1" },
            { property_name: "Cosy Family House", image_url: "url2", alt_tag: "tag2" },
            { property_name: "Chic Studio Near the Beach", image_url: "url3", alt_tag: "tag3" }
        ];

        const propertyRef= { 
            "Modern Apartment in City Center": 1, 
            "Cosy Family House": 2, 
            "Chic Studio Near the Beach": 3 };

        const output = {
            "Modern Apartment in City Center": 1,
            "Cosy Family House": 2,
            "Chic Studio Near the Beach": 3
        };

        expect(createImagesRef(input, propertyRef)).toEqual(output);
    });

});
