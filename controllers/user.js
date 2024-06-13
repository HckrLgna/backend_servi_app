const { response, request } = require("express");
const User = require("../models/user");
const Joi = require("@hapi/joi");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async ( req = request, res = response) => {
    const { email, password, name } = req.body;

    res.json({
        msg: "post API - userRegister",
    });
}