const Imagekit = require("imagekit");

const imageKit = new Imagekit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

async function uploadFile(file, filename) {
  const response = imageKit.upload({
    file: file,
    fileName: filename,
    folder: "promptVaultUsers",
  });
  return response;
}

module.exports = uploadFile;
