import user from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        const { _id, firstName, lastName, location, picturePath, cart } = user;
        const formattedUser = { _id, firstName, lastName, location, picturePath, cart };

        res.status(200).json({ formattedUser });

    } catch (error) {
        res.status(404).json({ "error while fetching user" });
        console.log(`error while fetching user: ${error}`)
    }
}