const {validationResult} = require('express-validator');
const https = require('https');

const HttpError = require('../models/http-error');

const Model = require('../models/car-models');
const Version = require('../models/car-versions');


const addModels = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    var country = req.body.country;
    var brand = req.body.brand;

    let marketId = "";
    if (country == "fr") {
        marketId = "fr_FR";
    } else if (country == "uk") {
        marketId = "en_GB";
    } else if (country == "de") {
        marketId = "de_DE"
    }
    let url = "https://zawwaisoe.com/digital_central/" + brand + "/" + marketId + "/classes.json";
    let version_url = "https://zawwaisoe.com/digital_central/" + brand + "/" + marketId + "/models.json";
    console.log("URL is " + url);

    try {
        var l_country = req.body.country;
        var l_brand = req.body.brand;
        await Model.deleteMany({country: country, brand: brand});
        let dataString = '';
        const req1 = https.get(url, function (res1) {
            res1.on('data', chunk => {
                dataString += chunk;
            });
            res1.on('end', () => {
                var alldata = JSON.parse(dataString);
                var allModels = alldata;

                for (var i = 0; i < allModels.length; i++) {
                    let oneModel = allModels[i];
                    let brand = l_brand;
                    let country = l_country;
                    let code = oneModel['classId'];
                    let name = oneModel['className'];
                    let versions = [];

                    const createdModel = new Model({
                        code,
                        name,
                        country,
                        brand,
                        versions
                    });
                    createdModel.save();
                }
            });
        });

        await Version.deleteMany({country:country,brand:brand});

        let dataString2 = '';
        console.log("version url si " + version_url);
        const req2 = https.get(version_url, function (res2) {
            res2.on('data', chunk => {
                dataString2 += chunk;
            });
            res2.on('end', async () => {
                var alldata1 = JSON.parse(dataString2);
                var allModels = alldata1;

                for (var i = 0; i < allModels.length; i++) {
                    let oneModel = allModels[i];

                    let brand = l_brand;
                    let country = l_country;

                    let code =  oneModel['modelId'];
                    let name =  oneModel['name'];
                    let model = oneModel['vehicleClass']['classId'];

                    let currency = oneModel['priceInformation']['currency'];
                    let price = oneModel['priceInformation']['price'];

                    const createdVersion = new Version({
                        code,
                        name,
                        model,
                        country,
                        brand,
                        currency,
                        price
                    });
                    createdVersion.save();

                    await Model.updateOne({"code":model , "country" :country } , { $push: { "versions": code } })
                }
            });
        });



    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'failed, please try again later.',
            500
        );
        return next(error);
    }finally {
        res.status(201).json({ model: "success"});
    }




};

const addModels1 = async (req, res, next) => {
    const {country, brand} = req.body;
    const createdModel = new Model({
        country,
        brand
    });

    try {
        await createdModel.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({model: createdModel.toObject({getters: true})});
}

exports.addModels = addModels;
exports.addModels1 = addModels1;

