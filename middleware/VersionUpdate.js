import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
const infolog = (msg) => {
    console.log(`\x1B[94m ${msg} \x1B[0m`);
}
const successlog = (msg) => {
    console.log(`\x1B[92m ${msg} \x1B[0m`);
};

const errorlog = (msg) => {
    console.log(`\x1B[91m ${msg} \x1B[0m`);
};
function VersionUpdate() {
    try {
        infolog('------------ 升级package.json版本号  ------------');
        const packageJsonStr = fs.readFileSync(path.resolve(process.cwd(), "package.json")).toString();
        const packageJson = JSON.parse(packageJsonStr);
        // 升级版本号
        const arr = packageJson.version.split('.');
        if (arr[2] < 99) {
            arr[2] = +arr[2] + 1;
        }
        else if (arr[1] < 9) {
            arr[1] = +arr[1] + 1;
            arr[2] = 0;
        }
        else {
            arr[0] = +arr[0] + 1;
            arr[1] = 0;
            arr[2] = 0;
        }
        const newVersion = arr.join('.');
        packageJson.version = newVersion;
        console.log("newVersion:", newVersion);
        fs.writeFileSync(path.resolve(process.cwd(), "package.json"), JSON.stringify(packageJson, null, '\t'))
        execSync(`git add package.json`);
    }
    catch (e) {
        console.error('处理package.json失败，请重试', e.message);
        process.exit(1);
    }
}
VersionUpdate()
