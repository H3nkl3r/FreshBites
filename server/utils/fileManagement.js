const path = require("path");
const fs = require("fs").promises;

const clearUploadDirectory = async (files) => {
  const directory = "./uploads";
  try {
    const unlinkPromises = files.map((file) => {
      return fs.unlink(path.join(directory, file.filename));
    });
    await Promise.all(unlinkPromises);
  } catch (err) {
    console.error(`Error deleting uploaded files: ${err}`);
  }
};

module.exports = {
  clearUploadDirectory,
};
