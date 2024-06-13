const { response, request } = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

var AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const Vehicle = require("../models/vehicle");

const vehiclesGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [total, vehicles] = await Promise.all([
    Vehicle.countDocuments(query),
    Vehicle.find(query).skip(Number(from)).limit(Number(limit)),
  ]);
  const responseMap = vehicles.reduce((acc, vehicle) => {
    acc[vehicle._id] = vehicle;
    return acc;
  }, {});

  res.json(responseMap);
};

const vehiclesPost = async (req = request, res = response) => {
  console.log(req.body);
  const { brand, model, typeCombustible, pathImage, nameImage } = req.body;
  try {
    //const name = `${Date.now()}${path.extname(file.originalname)}`;
    
    const licensePlate = await vehiclesRekognition(nameImage);
    //const licensePlate = "211GBC";
    const status = true;
    const vehicle = new Vehicle({
      brand,
      model,
      typeCombustible,
      licensePlate,
      pathImage,
      status,
    });
    await vehicle.save();
    res.json({
      msg: "post API - vehiclesPost",
      vehicle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al crear vehiculo",
    });
  }
};

const vehiclesDelete = (req = request, res = response) => {
  res.json({
    msg: "delete API - vehiclesDelete",
  });
};
const s3 = new S3Client({
  region: "us-east-1", // Change to your preferred region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const uploadImage = async (req = request, res = response) => {
  const file = req.file;
  const fileStream = fs.createReadStream(file.path);
  const name = `${Date.now()}${path.extname(file.originalname)}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Body: fileStream,
    acl: "public-read",
    Key: name,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams)); // Use promise() to convert to promise-based API
    console.log(data);
    // Remove the file from the server after successful upload
    fs.unlinkSync(file.path);
    res.json({
      msg: "upload API - images uploaded",
      pathImage: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`,
      name: uploadParams.Key,
    });
  } catch (err) {
    console.error(err);
    // Ensure to delete the file in case of an error
    fs.unlinkSync(file.path);
    res.status(500).json({
      msg: "Error al subir imagen",
    });
  }
};

const vehiclesRekognition = async(name) => {
  var result;
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: process.env.AWS_REGION,
  });
  var params = {
    Image: {
      S3Object: {
        Bucket: "data-information",
        Name: name,
      },
    },
  };
  const rekognition = new AWS.Rekognition();
  return new Promise((resolve, reject) => {
    rekognition.detectText(params, function (err, data) {
      
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        data.TextDetections.forEach((text) => {
          const plate = text.DetectedText;
          const platePattern = "^[0-2][0-9]{3}[A-ZÑ]{3}$";
          const match = plate.match(platePattern);
          console.log(match);
          
          if (match) {
            result = match[0];
          }
        });
        console.log(result);
        resolve(result);
      }
    });
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
};
function findPlate(text){
  const platePattern = "^[0-2][0-9]{3}[A-ZÑ]{3}$";
  const match = text.match(platePattern);
  return match ? match[0] : null;
}
module.exports = {
  vehiclesGet,
  vehiclesPost,
  vehiclesDelete,
  vehiclesRekognition,
  uploadImage,
};
