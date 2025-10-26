const { insertReview, deleteReviewsByPropertyId, fetchReviewsByPropertyId } = require("../models/reviews");

exports.postReviewsForProperty = async (req, res, next) => {
  if (!req.body.guestId || !req.body.rating || !req.body.comment) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  const review = await insertReview(
    req.params.id,
    req.body.guestId,
    req.body.rating,
    req.body.comment
  );
  res.status(201).send(review);
};

exports.deleteReviewsForProperty = async (req, res, next) => {
  const { id } = req.params;

  for (let i = 0; i < id.length; i++) {
    if (id[i] < "0" || id[i] > "9") {
      return res.status(400).send({ msg: "Bad Request" });
    }
  }

  try {
    const deletedReviews = await deleteReviewsByPropertyId(id);

    if (!deletedReviews || deletedReviews.length === 0) {
      return res.status(404).send({ msg: "Error: Review not found" });
    }

    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};

exports.getReviewsForProperty = async (req, res, next) => {
  const { id } = req.params;


  let isNumber = true;
  for (let i = 0; i < id.length; i++) {
    if (id[i] < "0" || id[i] > "9") {
      isNumber = false;
    }
  }

  if (!isNumber) {
    return res.status(400).send({ msg: "Bad Request" });
  }


  try {
    const reviews = await fetchReviewsByPropertyId(id);

    if (!reviews || reviews.length === 0) {
      return res.status(404).send({ msg: "Error: No reviews found for this property" });
    }

    let total = 0;
    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }

    averageRating = Math.round((total / reviews.length) * 10) / 10;

    res.status(200).send({
      reviews,
      average_rating: averageRating,
    });

  } catch (err) {
    next(err);
  }
};