import * as CryptoJS from "crypto-js";

class Block {
  // 블록 해쉬 계산
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  // 블록 구조 유효성 체크
  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  // Block 생성자
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    timestamp: number,
    data: string
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock: Block = new Block(0, "2020202020", "", 123456, "Hello"); // 첫번째 블록

let blockchain: Block[] = [genesisBlock]; // 블록체인

const getBlockchain = (): Block[] => blockchain; // 블록체인 얻기

const getLatestBlock = (): Block => blockchain[blockchain.length - 1]; // 마지막 블록 얻기

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000); // 새 timestamp 얻기

// 새로운 블록 생성
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );

  // 새로운 블록
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );

  addBlock(newBlock);

  return newBlock;
};

// 블록 hash값 계산
const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

// 블록 유효성 검사
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

// 블록체인에 블록 추가
const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};


createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");

console.log(blockchain);

export {};
