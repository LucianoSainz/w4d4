const express = require("express");
const router = express.Router();
const Services = require("../models/Services");
const Employees = require("../models/Employees");

router.get("/servicesAndEmployees/:nEmployees/:nServices/:nif?", (req, res, next) => {
  let allServices;

  Services.find()
    .limit(+req.params.nServices)
    .then(allServicesPayload => {
      allServices = allServicesPayload;
      return Employees.find().limit(+req.params.nEmployees);
    })
    .then(allEmployees => {
      let hbsPayload = {
        services: allServices,
        employees: allEmployees
      };

      if (req.params.nif !== undefined) {
        hbsPayload.showOnlyNIF = true;
      }

      res.render("servicesAndEmployees", hbsPayload);
    });
});

router.get("/servicesByNIF/:nif", (req, res, next) => {
  Services.find({ nif: req.params.nif }).then(service => {
    res.render("servicesAndEmployees", {
      services: service
    });
  });
});

// this renders the form for the "servicesByNIFQS" endpoint
router.get("/checkNIF", (req, res) => {
  res.render("searchByNIF");
});

// this consumes the querystring generated by the form in the "checkNIF" endpoint
router.get("/servicesByNIFQS", (req, res, next) => {
  console.log(req.query);

  Services.find({ nif: req.query.nif }).then(service => {
    res.render("servicesAndEmployees", {
      services: service
    });
  });
});

// this consumes the querystring generated by the form in the "checkNIF" endpoint
router.get("/services", (req, res, next) => {
  Services.find()
    .sort({ createdAt: -1 })
    .then(service => {
      res.render("servicesAndEmployees", {
        services: service
      });
    });
});

router.get("/getMap", (req, res, next) => {
  const cityPayload = req.query.city.toUpperCase();
  const streetPayload = req.query.street;

  res.render("map", {
    city: cityPayload,
    street: streetPayload
  });
});

router.get("/createService", (req, res) => {
  res.render("createService");
});

router.post("/createServicePOST", (req, res) => {
  Services.create({
    name: req.body.name,
    category: req.body.category,
    nif: req.body.nif
  }).then(() => {
    res.redirect("/services");
  });
});

module.exports = router;
