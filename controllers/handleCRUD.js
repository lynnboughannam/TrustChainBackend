const User = require("../models/userModels");

const handleCRUD = (Model) => {

    const create = async (req, res) => {
        try {

            const checkProduct = await Model.findOne({ productName: req.body.productName, supplier: req.body.supplier });

            // if (checkProduct) {
            //     return res.status(400).json({ message: "Raw Product already exist from same supplier" + req.body.supplier, });

            // }


            // const createdBy = await User.findById(req.body.createdBy);
            // if (!createdBy) {
            //     return res.status(400).json({ messgae: "User doesn't exist to add the raw products" });

            // }
            console.log(req.body)
            const newObject = new Model(req.body);
            const newProd = await newObject.save();
            console.log("newProd")
            console.log(newProd)

            console.log("newObject")
            console.log(newObject)
            return res.status(201).json({ message: "Product added sucessfully", data: { newProd } });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Failed to add new product", error });

        }
    }
    const readAll = async (req, res) => {
        try {
            const objects = await Model.find();
            if (objects == 0) {
                res.status(404).json({ message: "no objects" });

            }
            res.status(200).json(objects);


        } catch (error) {
            console.log(error);

        }
    }

    const readById = async (req, res) => {
        try {
            const object = await Model.findById(req.params.id);
            if (!object) {
                return res.status(404).json({ error: 'object not found' });
            }
            res.status(200).json(object);
        } catch (error) {
            console.log(error)
        }
    }


    const update = async (req, res) => {

        try {

            const object = await Model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            if (!object) {
                return res.status(404).json({ message: " Product doesnt exist" });

            }
            res.status(200).json({ message: "The product has been updated", data: { object } });

        } catch (error) {
            console.log(error)

        }

    }

    const remove = async (req, res) => {
        try {
            const object = await Model.findByIdAndRemove(req.params.id)
            if (!object) {
                return res.status(400).json({ message: "Product doesn't exist" });

            }
            res.status(200).json({ message: "The raw product has been deleted" });
        } catch (error) {
            console.log(error);
        }
    }
    return { create, readAll, readById, update, remove };




}
module.exports = { handleCRUD };