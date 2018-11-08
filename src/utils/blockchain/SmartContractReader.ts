import * as solc from 'solc';
import fs = require('fs');
import { Globals } from '../../utils/globals';
import { AbiItem } from './AbiItemModel';

const WEB3 = require('web3');

/**
 * @description Smart Contract Reader
 * @constructor {string} smartContractName The name of the smart contract that needs to be read
 * @private {any} contract The Pull Payment Account contract on the blockchain
 * @private {string} contractAddress The address of Pull Payment Account contract on the blockchain
 * */
export class SmartContractReader {
    private web3API: any;

    public constructor(private smartContractName: string, networkID: number) {
        this.web3API = new WEB3(new WEB3.providers.HttpProvider(Globals.GET_SPECIFIC_INFURA_URL(networkID)));
    }

    /**
     * @description Reads the ABI of the smart contract specified
     * @param {string} smartContractName  Name of the smart contract
     * @returns {any} Returns the ABI of the smart contract
     * */
    public readABI(): any {
        const input = fs.readFileSync(Globals.GET_SMART_CONTRACTS(), 'utf-8');
        const output = solc.compile(input.toString(), 1);

        return JSON.parse(output.contracts[`:${this.smartContractName}`].interface);
    }

    /**
     * @description Reads the smart contract specified
     * @param {string} smartContractAddress - The address of the smart contract
     * @returns {any} Returns the smart contract instance on that address
     * */
    public readContract(smartContractAddress: string): any {
        const contractABI = this.readABI();

        return new this.web3API.eth.Contract(contractABI, smartContractAddress);
    }

    /**
     * @description Reads the contract logs
     * @param {array} topics - Array of topics returned by smart contract
     * @param {string} data - Data returned by smart contract
     * @returns {any} Returns the response from smart contract execution
     * */
    public readEventLogs(topic: string, data: string): any {
        const abi: AbiItem[] = this.readABI();
        const response: object = {};
        abi.filter(abiInterace => abiInterace.inputs).map(abiInterface => {
            if (this.web3API.utils.sha3(`${abiInterface.name}(${abiInterface.inputs.map(input => input.type)})`) === topic) {
                const r: any = this.web3API.eth.abi.decodeLog(abiInterface.inputs, data, topic);
                abiInterface.inputs.map(input => {
                    response[input.name] = r[input.name];
                });
            }
        });

        return response;
    }
}