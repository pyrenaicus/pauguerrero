import { deploy, excludeDefaults } from "@samkirkland/ftp-deploy";

async function deployMyCode() {
  console.log("🚚 Deploy started");
  await deploy({
    server: process.env.FTP_SERVER,
    username: process.env.FTP_USER,
    password: process.env.FTP_PWD,
    "local-dir": "./_site/",
    "server-dir": process.env.SERVER_DIR,
  });
  console.log("🚀 Deploy done!");
}

deployMyCode();
