//middleware to check if the user is has premium access

import { clerkClient } from "@clerk/express";


export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    const hasPremiumPlan = await has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);

    // Check if user has free_usage in publicMetadata, if not initialize it
    if (!hasPremiumPlan && user.publicMetadata.free_usage !== undefined) {
      req.free_usage = user.publicMetadata.free_usage;
    } else {
      // Initialize free_usage if it doesn't exist
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
