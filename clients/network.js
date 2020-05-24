const { networkInterfaces, networkInterfaceInfo } = require('os')
// taken from https://gist.github.com/sviatco/9054346

module.exports = {

  getPrivateIPs: () => {
    return Object.values(networkInterfaces())
      .flatMap((infos) => {
        return infos.filter((i) => i.family === 'IPv4');
      })
      .filter((info) => {
        return (
          info.address.match(
            /(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/
          ) !== null
        );
      }).map(i => i.address);
  }
}