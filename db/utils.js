function createUserRef(usersArray) {
  const result = {};

  usersArray.forEach((user, index) => {
    const fullName = `${user.first_name} ${user.surname}`;
    result[fullName] = index + 1; // user_id starting from 1
  });

  return result;   
}

function createPropertyRef(properties) {
  const result = {};

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    result[property.name] = property.property_id;
  }

  return result;
}

function createImagesRef(imagesArray, propertyRef) {
  const result = {};

  imagesArray.forEach((image) => {
    result[image.property_name] = propertyRef[image.property_name];
  });
  return result;
}

module.exports = { createUserRef, createPropertyRef, createImagesRef};