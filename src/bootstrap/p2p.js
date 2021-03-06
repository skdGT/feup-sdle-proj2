const PeerId = require('peer-id');
const Libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const {NOISE} = require('libp2p-noise');
const MPLEX = require('libp2p-mplex');
const MulticastDNS = require('libp2p-mdns');
const DHT = require('libp2p-kad-dht');


const KEY = process.env.KEY || 'bootstrap1.json';
const KEY_JSON = require('./keys/' + KEY);
const PORT = process.env.PORT || 8998;

/*
 * » BOOTSTRAP NODE «
 *
 * This is still a work in progress!!
 */


async function create_peer_id() {
    const peerId = await PeerId.create({keyType: 'Ed25519', bits: 1024});
    console.log(peerId.toJSON());
}


async function create_node() {
    const peerId = await PeerId.createFromJSON(KEY_JSON);

    console.log("Read Key:", peerId.toJSON());

    const node = await Libp2p.create({
        peerId,
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/' + PORT]
        }, modules: {
            transport: [TCP],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX],
            peerDiscovery: [MulticastDNS],
            dht: DHT,
        }, config: {
            peerDiscovery: {
                autoDial: true,
                [MulticastDNS.tag]: {
                    interval: 1000,
                    enabled: true
                },
            },
            dht: {
                enabled: true
            }
        }
    });

    node.on('peer:discovery', (peer) => {
        console.log('peer:discovery', peer.toB58String());
    });

    node.connectionManager.on('peer:connect', async (connection) => {
        console.log('Connected to:', connection.remotePeer.toB58String());
    })

    await node.start();
    console.log('libp2p has started');

    const listenAddrs = node.transportManager.getAddrs();
    console.log('listen:', listenAddrs);

    const advertiseAddrs = node.multiaddrs;
    console.log('advertise:', advertiseAddrs);

    return node;
}

// create_peer_id().then(() => {});

create_node()
   .then(node => console.log("Bootstrap Node Started!", node.peerId.toB58String()));