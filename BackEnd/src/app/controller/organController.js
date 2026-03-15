const Organization = require("../model/organization");
const crypto = require("crypto");

class organController {

    // CREATE ORGANIZATION
    async createOrganization(req, res) {

        try {

            const { name } = req.body;

            const owner = req.user.walletAddress;
            console.log(owner);
            const code = crypto
                .randomBytes(4)
                .toString("hex");

            const organization =
                await Organization.create({

                    name,
                    owner,
                    code,

                    members: [
                        {
                            walletAddress: owner,
                            status: "approved"
                        }
                    ]

                });

            res.json(organization);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

    // JOIN ORGANIZATION
    async joinOrganization(req, res) {

        try {

            const { code, walletAddress } =
                req.body;

            const organization =
                await Organization.findOne({
                    code
                });

            if (!organization) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Organization not found"
                    });

            }

            organization.members.push({
                walletAddress,
                status: "pending"
            });

            await organization.save();

            res.json({
                message:
                    "Join request sent"
            });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

    // APPROVE MEMBER
    async approveMember(req, res) {

        try {

            const {
                organizationId,
                walletAddress
            } = req.body;

            const organization =
                await Organization.findById(
                    organizationId
                );

            const member =
                organization.members.find(
                    m =>
                        m.walletAddress ===
                        walletAddress
                );

            if (!member) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Member not found"
                    });

            }

            member.status = "approved";

            await organization.save();

            res.json({
                message:
                    "Member approved"
            });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

    // REJECT MEMBER
    async rejectMember(req, res) {

        try {

            const {
                organizationId,
                walletAddress
            } = req.body;

            const organization =
                await Organization.findById(
                    organizationId
                );

            organization.members =
                organization.members.filter(
                    m =>
                        m.walletAddress !==
                        walletAddress
                );

            await organization.save();

            res.json({
                message:
                    "Member rejected"
            });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

    // GET ORGANIZATION
    async getOrganization(req, res) {

        try {

            const { id } = req.params;

            const organization =
                await Organization.findById(id);

            if (!organization) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Organization not found"
                    });

            }

            res.json(organization);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }

}

module.exports = new organController();