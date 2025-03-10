const user = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.changePassword = async (req, res) => {
    try {
        let id = req.params.id

        let userId = await user.findById(id);

        let { currentPassword, newPassword, confirmPassword } = req.body;

        let passwordCompare = await bcrypt.compare(currentPassword, userId.password);

        if (!passwordCompare) {
            return res.json({ status: 400, message: "Current Password Not Match" })
        }
        if (newPassword !== confirmPassword) {
            return res.json({ status: 400, message: "New Password And Confirm Password Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.newPassword, salt);

        let updatePassword = await user.findByIdAndUpdate(id, { password: hashPassword }, { new: true })


        return res.json({ status: 200, message: "Password Changed SuccessFully...", user: updatePassword })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

const genAccRefToken = async (id) => {
    try {

        const userD = await user.findById(id);

        const accessToken = await jwt.sign(
            {
                _id: userD._id,
                role: userD.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1 Day" }
        );

        const refreshToken = await jwt.sign(
            {
                _id: id
            },
            process.env.REFRESH_TOEKN,
            { expiresIn: '2 Day' }
        );

        userD.refreshToken = refreshToken;

        await userD.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
    }
}

exports.userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const chekEmail = await user.findOne({ email: email });
        if (!chekEmail) {
            return res.json({ status: 400, message: "Email Not Found" });
        }

        // Compare passwords
        const passwordCompare = await bcrypt.compare(password, chekEmail.password);
        if (!passwordCompare) {
            return res.json({ status: 400, message: "Password Not Match" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await genAccRefToken(chekEmail._id);

        chekEmail.refreshToken = refreshToken;
        await chekEmail.save();

        const optionsAcc = {
            httpOnly: true,
            // secure: true,
            // sameSite: 'None',
            maxAge: 60 * 60 * 24 * 1000
        }

        const optionsRef = {
            httpOnly: true,
            // secure: true,
            // sameSite: 'None',
            maxAge: 60 * 60 * 24 * 10 * 1000
        }

        const userDataF = await user.findById(chekEmail._id).select("-password -refreshToken");

        res.status(200)
            .cookie("accessToken", accessToken, optionsAcc)
            .cookie("refreshToken", refreshToken, optionsRef)
            .json({
                status: 200,
                success: true,
                message: "Login successfully.",
                user: userDataF,
                AccessToken: accessToken,
            })

    } catch (error) {
        console.log(error);
        return res.json({ status: 500, message: error.message });
    }
};
exports.userLogout = async (req, res) => {
    console.log("logoutttttttttt", req.body);

    try {
        const u = await user.findByIdAndUpdate(
            req.params.id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        );

        console.log(u);

    } catch (error) {
        console.log("errr logouttt", error);

    }

    const options = {
        httpOnly: true,
        // secure: true,
        // sameSite: 'None'
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logged Out"
        })
};

exports.checkAuth = async (req, res) => {
    try {
        const accessToken = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Token not found.",
                isExpired: true  // Add flag to indicate token issues
            });
        }

        try {
            const validateUser = await jwt.verify(accessToken, process.env.SECRET_KEY);

            return res.status(200).json({
                success: true,
                data: validateUser,
                message: "User authenticated."
            });
        } catch (tokenError) {
            // Token verification failed (expired or invalid)
            const options = {
                httpOnly: true,
                // secure: true,
                // sameSite: 'None'
            };

            return res.status(401)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({
                    success: false,
                    message: "Token expired or invalid.",
                    isExpired: true  // Add flag to indicate token expiration
                });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
}


exports.generateNewTokens = async (req, res) => {
    try {
        const checkToken = req?.cookies?.refreshToken;
        console.log("refreshToken", checkToken);
        // const cookieOptions = {
        //     httpOnly: true,
        //     // secure: true,
        //     // sameSite: 'None'
        // }

        const optionsAcc = {
            httpOnly: true,
            // secure: true,
            // sameSite: 'None',
            // maxAge: 60 * 60 * 24 * 1000
        }

        const optionsRef = {
            httpOnly: true,
            // secure: true,
            // sameSite: 'None',
            maxAge: 60 * 60 * 24 * 10 * 1000
        }

        if (!checkToken) {
            return res.json({ status: 401, message: "Refresh Token Not Found" })
        }

        const decodedToken = jwt.verify(checkToken, process.env.REFRESH_TOEKN)

        let userId = await user.findById(decodedToken._id);

        if (!userId) {
            return res.json({ status: 401, message: "Invalid Refrsh Token" })
        }

        if (!userId || userId.refreshToken !== checkToken) {
            return res
                .status(401)
                .json({ status: 401, message: "Refresh token is expired" })
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await genAccRefToken(userId._id);


        userId.refreshToken = newRefreshToken;
        await userId.save();

        return res.status(200)
            .cookie("accessToken", newAccessToken, optionsAcc)
            .cookie("refreshToken", newRefreshToken, optionsRef)
            .json({
                data: { accessToken: newAccessToken },
                AccessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: userId,
                success: true,
                message: "Tokens refreshed successfully",
            });

    } catch (error) {
        console.log(error);
        return res.status(500)
            // .clearCookie("AccessToken")
            // .clearCookie("refreshToken")
            .json({
                success: false,
                message: "error.message"
            });
    }
}

exports.checkD = async (req, res) => {
    res.status(200)
        .json({
            success: true,
            message: "OKK",
        })
}