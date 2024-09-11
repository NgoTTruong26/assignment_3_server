import { createPublicClient, http } from 'viem'
import { bscTestnet } from 'viem/chains'

export const clientPublic = createPublicClient({
  chain: bscTestnet,
  transport: http('https://bsc-testnet.nodereal.io/v1/1234355755e141b1bbf1a81e398793af'),
})
