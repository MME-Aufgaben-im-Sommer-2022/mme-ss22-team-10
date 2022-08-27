const sdk = require("node-appwrite");
const { Configuration, OpenAIApi } = require("openai");
const { Query } = require("appwrite");
// disable eslint
/* eslint-disable */
// disable jshint
/* jshint ignore:start */

// AFTER MAKING CHANGES TO THIS FILE:
// run `appwrite deploy function` in the `appwrite/` directory to deploy changes to Appwrite
// (make sure you installed appwrite via `npm install -g appwrite-cli`)

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function(req, res) {
  console.log("start executing function...");
  const client = new sdk.Client();
  let generatedTitle = "";
  console.log("created client");


  if (
    !req.env["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.env["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    const APPWRITE_FUNCTION_ENDPOINT = req.env["APPWRITE_FUNCTION_ENDPOINT"],
      APPWRITE_FUNCTION_PROJECT_ID = req.env["APPWRITE_FUNCTION_PROJECT_ID"],
      APPWRITE_FUNCTION_API_KEY = req.env["APPWRITE_FUNCTION_API_KEY"],
      APPWRITE_FUNCTION_DATABASE_KEY = req.env["APPWRITE_FUNCTION_DATABASE_KEY"],
      APPWRITE_FUNCTION_USER_ID = req.env["APPWRITE_FUNCTION_USER_ID"],
      APPWRITE_FUNCTION_COLLECTION_NOTES = req.env["APPWRITE_FUNCTION_COLLECTION_NOTES"],
      APPWRITE_FUNCTION_BLOCK_CONTENTS = req.env["APPWRITE_FUNCTION_BLOCK_CONTENTS"],
      APPWRITE_FUNCTION_OPEN_AI_KEY = req.env["APPWRITE_FUNCTION_OPEN_AI_KEY"];

    // log all
    console.log(
      "APPWRITE_FUNCTION_ENDPOINT: " + APPWRITE_FUNCTION_ENDPOINT,
      "APPWRITE_FUNCTION_PROJECT_ID: " + APPWRITE_FUNCTION_PROJECT_ID,
      "APPWRITE_FUNCTION_API_KEY: " + APPWRITE_FUNCTION_API_KEY,
      "APPWRITE_FUNCTION_DATABASE_KEY: " + APPWRITE_FUNCTION_DATABASE_KEY,
      "APPWRITE_FUNCTION_USER_ID: " + APPWRITE_FUNCTION_USER_ID,
      "APPWRITE_FUNCTION_COLLECTION_NOTES: " + APPWRITE_FUNCTION_COLLECTION_NOTES,
      "APPWRITE_FUNCTION_BLOCK_CONTENTS: " + APPWRITE_FUNCTION_BLOCK_CONTENTS,
      "APPWRITE_FUNCTION_OPEN_AI_KEY: " + APPWRITE_FUNCTION_OPEN_AI_KEY
    );

    console.log("creating client...");
    client
      .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.env["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);
    console.log("created client");
    // OUR STUFF HERE
    generatedTitle = await getTitleFromOpenAi(req, client);
    console.log("generated title: " + generatedTitle);
  }

  res.json({
    generatedTitle
  });
};

async function getBlockContents(req, client) {
  let database = new sdk.Database(
      client,
      req.env["APPWRITE_FUNCTION_DATABASE_KEY"]
    ),
    userId = req.env["APPWRITE_FUNCTION_USER_ID"],
    collectionNotes = req.env["APPWRITE_FUNCTION_COLLECTION_NOTES"],
    collectionBlockContents = req.env["APPWRITE_FUNCTION_BLOCK_CONTENTS"];
  blockContentArray = new Array();

  const noteDocuments = await database.listDocuments(
    collectionNotes,
    [Query.equal("userID", userId)],
    3
  );
  noteDocuments.documents.forEach((note) => {
    blockContentDocuments = await database.listDocuments(
      collectionBlockContents,
      [Query.equal("noteID", note.$id)]
    );
    blockContentDocuments.forEach((blockContent) => {
        blockContentArray.push(blockContent);
      }
    );
  });
  return blockContentArray;
}

async function getTitleFromOpenAi(req, client) {
  const noteContents = "", blockContents = await getBlockContents(req, client),
    OPENAI_API_KEY = req.env["APPWRITE_FUNCTION_OPEN_AI_KEY"];

  blockContents.forEach((blockContent) => {
    noteContents += blockContent.title + "\n";
    noteContents += blockContent.inputValue + "\n\n";
  });
  const prompt = `These are the contents of your last 3 daily notes:\n"""\n${noteContents}"""\nComplete the following:\nRecently you were thinking about ..., what do you think about...?`;
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  return await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
}
