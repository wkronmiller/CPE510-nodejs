# About

I bought a TP-Link CPE-510 v3. It's, uh, flakey...probably my fault.
Anyway, I want to keep track of its status without having to login
to the GUI, so I threw together this little script.

Right now, it just logs you in and dumps the status JSON.

# Usage

1. Export `USERNAME` and `PASSWORD` environment variables.
2. Set the `TP_LINK_HOST` environment variable to the IP address of your host (e.g. `192.168.0.254`).
3. Run `yarn install`
4. Run `node src/index.js`
