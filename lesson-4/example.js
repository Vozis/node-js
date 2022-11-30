import fsp from "fs/promises";

const getFileList = async (dirName) => {
  let files = [];
  const items = await fsp.readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  // console.log(files);
  return files;
};

getFileList("../lesson-4").then((files) => {
  console.log(files);
});
