import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY
    created_at DESC`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicCreations = async (req, res) => {
  try {
    const creations = await sql`SELECT * FROM creations WHERE publish = true
      ORDER BY created_at DESC`;
    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentlike = await creation.likes;
    const userIdstr = userId.toString();
    let updatedLikes;
    let message;

    if (currentlike.includes(userIdstr)) {
      updatedLikes = currentlike.filter((user) => user !== userIdstr);
      message = "Creation unliked ";
    } else {
      updatedLikes = [...currentlike, userIdstr];
      message = "Creation liked ";
    }
    const formattedArray = `{${updatedLikes.join(",")}}`;
    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
    const [updatedCreation] =
      await sql`SELECT * FROM creations WHERE id = ${id}`;
    res.json({
      success: true,
      message,
      creation
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
