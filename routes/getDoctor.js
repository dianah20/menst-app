const router = require("express").Router();
const GetDoctor = require("../models/GetDoctor");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./jwtoken");

// CREATE A GETDOCTOR REQUEST*****************************
router.post("/", verifyToken, async (req, res) => {
  const doctor = new GetDoctor({
    fullName: req.body.fullName,
    tel: req.body.tel,
    email: req.body.email,
    location: req.body.location,
    qbody: req.body.qbody,
    age: req.body.age,
  });
  try {
    const savedDoctor = await doctor.save();
    return res.status(201).json({
      message: "Success, get doctor request sent successfully",
      savedDoctor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// UPDATE GET DOCTOR REQUEST*****************************
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedDoctor = await GetDoctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Request updated succesfully", updatedDoctor });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE REQUEST*****************************
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await GetDoctor.findByIdAndDelete(req.params.id);
    return res.status(200).json("Request has been deleted...");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// GET A REQUEST*****************************
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const doctor = await GetDoctor.findById(req.params.id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL REQUESTS*****************************
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const doctor = query
      ? await GetDoctor.find().sort({ _id: -1 }).limit(5)
      : await GetDoctor.find();
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
