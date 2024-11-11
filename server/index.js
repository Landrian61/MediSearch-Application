const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", express.static(__dirname + "/frontend"));

// Constants - Update the URL structure based on VEXT documentation
const VEXT_API_KEY = process.env.VEXT_API_KEY;
const VEXT_BASE_URL = process.env.VEXT_BASE_URL;
const CHANNEL_TOKEN = process.env.CHANNEL_TOKEN;

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  if (!VEXT_API_KEY) {
    return res.status(500).send({
      error: "Server configuration error: VEXT_API_KEY not set"
    });
  }
  next();
};

// Main API endpoint
app.post("/get-prompt-result", validateApiKey, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({
      error: "Prompt is missing in the request",
      status: "error"
    });
  }

  try {
    const response = await axios({
      method: "post",
      url: `${VEXT_BASE_URL}/${CHANNEL_TOKEN}`,
      headers: {
        "Content-Type": "application/json",
        Apikey: `Api-Key ${VEXT_API_KEY}`
      },
      data: {
        payload: prompt
      }
    });

    // Add proper error handling for VEXT-specific error responses
    if (response.data.error) {
      return res.status(400).send({
        error: response.data.error,
        status: "error"
      });
    }

    return res.send({
      data: response.data,
      status: "success"
    });
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "An error occurred while processing your request";

    return res.status(statusCode).send({
      error: errorMessage,
      status: "error"
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
