const Organization = require("../model/organization");
const User = require("../model/user");
const crypto = require("crypto");

class organController {

    // CREATE ORGANIZATION
    async createOrganization(req, res) {
        try {
            const { name, description, memberLimit, approvalType } = req.body;
            const owner = req.user.id;
            console.log(`[organController] Creating organization: ${name} for owner: ${owner}`);
            
            const code = crypto
                .randomBytes(4)
                .toString("hex");

            const organization = await Organization.create({
                name,
                description,
                memberLimit: memberLimit || 1000,
                approvalType: approvalType || "manual",
                owner,
                code,
                members: [
                    {
                        user_id: owner,
                        status: "approved"
                    }
                ]
            });

            console.log(`[organController] Organization created successfully: ${organization.code}`);
            res.json(organization);
        } catch (error) {
            console.error(`[organController] Create error:`, error);
            res.status(500).json({
                error: error.message
            });
        }
    }

    // JOIN ORGANIZATION
    async joinOrganization(req, res) {
        try {
            const { code } = req.body;
            // Lấy walletAddress từ JWT (không tin req.body)
            const walletAddress = req.user.walletAddress.toLowerCase();
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const organization = await Organization.findOne({ code });

            if (!organization) {
                return res.status(404).json({ error: "Organization not found" });
            }

            // Kiểm tra chủ tổ chức có phải người tham gia không
            if (organization.owner.toLowerCase() === walletAddress) {
                return res.status(400).json({ error: "You are the owner of this organization" });
            }

            // Kiểm tra đã tham gia chưa (bao gồm cả pending, approved, rejected)
            const alreadyMember = await Organization.findOne({
                _id: organization._id,
                members: {
                    $elemMatch: {
                        user_id: req.user.id
                    }
                }
            });

            if (alreadyMember) {
                return res.status(400).json({
                    error: "You have already joined or sent a request to this organization"
                });
            }

            organization.members.push({
                user_id: req.user.id,
                status: "pending"
            });

            await organization.save();

            res.json({ message: "Join request sent" });

        } catch (error) {
            console.error('[joinOrganization] Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // APPROVE MEMBER
    async approveMember(req, res) {

        try {

            const {
                organizationId,
                member_id
            } = req.body;

            const organization =
                await Organization.findById(
                    organizationId
                );

            if (req.user.id != organization.owner) {
                return res
                    .status(403)
                    .json({
                        error:
                            "Only the owner can approve members"
                    });
            }

            const member =
                organization.members.find(
                    m =>m.user_id.toString() === member_id
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
                member_id
            } = req.body;

            const organization =
                await Organization.findById(
                    organizationId
                );
            console.log(`[organController] Rejecting member: ${member_id} from organization: ${organization.owner}`);
            if (req.user.id != organization.owner) {
                return res
                    .status(403)
                    .json({
                        error:
                            "Only the owner can reject members"
                    });
            }

            const member =
                organization.members.find(
                    m =>
                        m.user_id.toString() === member_id  
                );

            if (!member) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Member not found"
                    });
            }

            member.status = "rejected";

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
                await Organization.findById(id).populate("members.user_id", "walletAddress name");

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

    // GET ALL ORGANIZATIONS
    async getAllOrganizations(req, res) {
        try {
            console.log(`[organController] Getting all organizations`);
            const organizations = await Organization.find();
            res.json(organizations);
        } catch (error) {
            console.error(`[organController] Get all error:`, error);
            res.status(500).json({
                error: error.message
            });
        }
    }

    // GET MY ORGANIZATIONS
    async getMyOrganizations(req, res) {
        try {
            const owner_id = req.user.id;
            console.log(`[organController] Getting organizations for user: ${owner_id}`);
            const organizations = await Organization.find({
                $or: [
                    { owner: owner_id },
                    { "members.user_id": owner_id }
                ]
            });
            res.json(organizations);
        } catch (error) {
            console.error(`[organController] Get my error:`, error);
        }
    }

    // GET JOINED ORGANIZATIONS (APPROVED ONLY)
    async getJoinedOrganizations(req, res) {
        try {
            const walletAddress = req.user.walletAddress;
            console.log(`[organController] Getting joined organizations for user: ${walletAddress}`);
            const organizations = await Organization.find({
                members: {
                    $elemMatch: {
                        walletAddress: walletAddress,
                        status: "approved"
                    }
                }
            });
            res.json(organizations);
        } catch (error) {
            console.error(`[organController] Get joined error:`, error);
            res.status(500).json({
                error: error.message
            });
        }
    }

 
}

module.exports = new organController();