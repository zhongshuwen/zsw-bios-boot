
const { exec } = require('child_process');
const path = require('path');

function runShellCmd(options, cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        return reject(new Error(error+""));
      }else{
        resolve(stdout);
      }
    });
  })
}

async function stopNode(nodeDir){
  return runShellCmd({cwd:nodeDir},path.join(nodeDir, "zswgds.sh")+" stop");
}

module.exports = {
  stopNode,

}