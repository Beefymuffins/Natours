import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

// ----- TOURS -----
const aliasTopTours = (req, res, next) => {
    // prefilling the query string for top 5 tours.
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

const getAllTours = async (req, res) => {
    try {
        // Pass the model & query string into the APIFeatures class. To do any query modifications before being called
        const features = new APIFeatures(Tour, req.query) // lecture says use Tour.find() but I think thats wrong.
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        // ----- Send Response -----
        // "status" & "results" are Optional. But, nice to have
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours, // tours: tours
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); // OR: Tour.findOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            results: tour.length,
            data: {
                tour, // tour: tour
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body); // OR: const newTour = new Tour({}); newTour.save();

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
            // message: 'Invalid data sent!',
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // new updated object will be returned
            runValidators: true,
        });

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        // Send no data back when deleting something
        res.status(204).json({
            status: 'Success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

export {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
};
