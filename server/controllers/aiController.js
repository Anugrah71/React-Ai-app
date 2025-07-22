import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from "fs";
import Pdf from "pdf-parse/lib/pdf-parse.js";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Verify GEMINI_API_KEY is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable");
}

export const generateArticle = async (req, res) => {
  try {
    console.log("=== generateArticle called ===");
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue",
      });
    }

    console.log("Calling Gemini API...");
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length || 1000,
    });

    const content = response.choices[0].message.content;

    // Insert into database
    const result =
      await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${prompt}, ${content}, 'article') RETURNING id`;

    // Update user metadata if not premium
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
      creationId: result[0]?.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    // Insert into database
    const result =
      await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${prompt}, ${content}, 'article') RETURNING id`;

    // Update user metadata if not premium
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    console.log("=== generateImage called ===");
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // Insert into database

    await sql`INSERT INTO creations (user_id, prompt, content, type , publish) 
    VALUES (${userId}, ${prompt}, ${secure_url}, 'image' , ${
      publish ?? false
    })`;

    // Update user metadata if not premium

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.error("Error in generateImage:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const RemoveImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // Insert into database

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, 'Remove background from image' , ${secure_url}, 'image')`;

    // Update user metadata if not premium

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.error("Error in RemoveImageBackground:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const RemoveImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });
    // Insert into database

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${`Remove ${object} from image`} , ${imageUrl}, 'image')`;

    // Update user metadata if not premium

    res.json({
      success: true,
      content: imageUrl,
    });
  } catch (error) {
    console.error("Error in RemoveImageBackground:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ResumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "File size is too large. Please upload a file less than 5MB",
      });
    }
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await Pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths 
    ,weaknesses ,and areas for improvement. Resume content: \n\n${pdfData.text}`;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    // Insert into database

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, 'Review the uploaded resume' , ${content}, 'Resume-review')`;

    // Update user metadata if not premium

    res.json({
      success: true,
      content: content,
    });
  } catch (error) {
    console.error("Error in RemoveImageBackground:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
