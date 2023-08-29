import * as IPFS from 'ipfs';
import fs from 'fs';

export class IpfsUtils {
    constructor() {
        this.node = null;
        this.metadataIndex = new Map();
    }

    // Read image file in specified path
    readImageFile(path) {
        return fs.readFileSync(path);
    }

    // Start IPFS node
    async start(config = {}) {
        this.node = await IPFS.create(config);
    }

    // Stop IPFS node
    async stop() {
        await this.node.stop();
    }

    // add data to IPFS
    async addData(data, metadata = {}) {
        const newItem = {
            data,
            metadata,
            timestamp: Date.now()
        };
        const addedData = await this.node.add(JSON.stringify(newItem));
        const cid = addedData.cid.toString();
        this.metadataIndex.set(cid, metadata);
        return cid;
    }

    // add an array of data to IPFS
    async addMultipleData(newItem) {
      const cids = [];
      for (const i of newItem) {
        const cid = await this.addData(i.data, i.metadata);
        cids.push(cid);
      }
      return cids;
    }

    // Get data from IPFS
    async getData(cid) {
      const buffer = [];
      for await (const chunk of this.node.cat(cid)) {
        buffer.push(chunk);
      }
      const item = JSON.parse(Buffer.concat(buffer).toString());
      return item.data;
    }

    // Get array of data from IPFS
    async getMultipleData(cids) {
      const results = [];
      for (const cid of cids) {
        const data = await this.getData(cid);
        results.push(data);
      }
      return results;
    }

    // Update the value of existing data in IPFS
    async updateData(oldCID, newData, newMetadata = {}) {
      const newCID = await this.addData(newData, newMetadata);
      this.metadataIndex.delete(oldCID);
      return newCID;
    }

    // Unpin data
    async unpinData(cid) {
      await this.node.pin.rm(cid);
      this.metadataIndex.delete(cid);
    }
}
