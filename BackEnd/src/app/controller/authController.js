const { ethers } = require("ethers");
const User = require("../model/user");
const authService = require("../service/authService");

const jwt = require("jsonwebtoken");
class authController{

    async requestMessage (req, res)  {

        try {

            const { walletAddress } = req.body;

            const message = `Sign this message to login: ${walletAddress}`;

            res.json({ message });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    };

    async verifySignature(req, res) {

        try {

            const { message, signature } = req.body;
            console.log("Bug");
            const address =
                await authService.verifySignature(
                    message,
                    signature
                );
            console.log(address);
            let user = await User.findOne({
                walletAddress: address.toLowerCase()
            });

            if (!user) {

                user = await User.create({
                    walletAddress: address
                });

            }

            const token = jwt.sign(
                { id: user._id,
                  walletAddress: address
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({
                token,
                user
            });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    };

    //USING FOR FRONT-END
    async getSign(req, res){
        const {private_key, message} = req.body;
        const wallet = new ethers.Wallet(private_key);
        const sign = await wallet.signMessage(message);
        res.json({"sign": sign});
    };

    async getProfile (req, res) {

        try {

            const user = await User.findById(req.user.id);

            res.json(user);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    };
};
module.exports= new authController();

