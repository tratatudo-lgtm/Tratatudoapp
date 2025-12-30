
import { BlockchainTx } from '../types';

// Em produção, importaríamos ethers de: https://esm.sh/ethers@6.11.1
// const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

/**
 * Calcula o hash SHA-256 de uma string ou ficheiro para imutabilidade.
 */
export async function calculateHash(content: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Simula ou executa a notarização de um documento na Polygon.
 * Para integração real, esta função chamaria o Smart Contract 'TrataTudoNotary'.
 */
export const certifyDocumentOnChain = async (docName: string, category: string): Promise<BlockchainTx> => {
  // 1. Gerar hash real baseado no conteúdo simulado
  const hash = await calculateHash(`${docName}-${category}-${Date.now()}`);
  
  // 2. Simular delay da rede Polygon (2-4 segundos)
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  // 3. Retornar metadados da transação
  return {
    hash,
    blockNumber: Math.floor(Math.random() * 500000) + 58000000, // Blocos atuais da Polygon
    timestamp: new Date().toISOString(),
    network: 'Polygon Mainnet'
  };
};

export const getExplorerUrl = (txHash: string) => {
  return `https://polygonscan.com/tx/${txHash}`;
};
