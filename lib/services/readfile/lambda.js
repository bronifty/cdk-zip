import fs from "fs";
import path from "path";

export const handler = async (event) => {
  const filePath = path.join(process.cwd(), "yourfile.txt");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log(data);
    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to read file: " + err.message,
    };
  }
};
