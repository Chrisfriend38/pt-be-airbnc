const { fetchUsers } = require("../models/users");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.status(200).send({users: [] });


    } catch (error) {
        res.status(500).send({ msg:"Server Error." })
    }
};
    
exports.postProperty = async (req, res, next) => {
        const { property, property-types } = req.body;

        const property = await insertProperty();

        res.status(201).send({ property });

};
