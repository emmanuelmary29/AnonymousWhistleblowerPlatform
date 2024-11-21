import { describe, it, expect, beforeEach } from 'vitest'
import { mockNet } from './mocks'

describe('simple-encryption', () => {
  let client: any
  
  beforeEach(() => {
    client = mockNet.createClient()
  })
  
  it('encrypts and decrypts empty data', async () => {
    const data = '0x' + '00'.repeat(32)
    const key = '0x' + '02'.repeat(32)
    
    const encryptResult = await client.encryptData(data, key)
    expect(encryptResult.success).toBe(true)
    
    const decryptResult = await client.decryptData(encryptResult.value, key)
    expect(decryptResult.success).toBe(true)
    expect(decryptResult.value).toBe(data)
  })
  
  it('encrypts data with different keys', async () => {
    const data = '0x' + 'ff'.repeat(32)
    const key1 = '0x' + '02'.repeat(32)
    const key2 = '0x' + '03'.repeat(32)
    
    const encryptResult1 = await client.encryptData(data, key1)
    expect(encryptResult1.success).toBe(true)
    
    const encryptResult2 = await client.encryptData(data, key2)
    expect(encryptResult2.success).toBe(true)
    
    expect(encryptResult1.value).not.toBe(encryptResult2.value)
    
    const decryptResult1 = await client.decryptData(encryptResult1.value, key1)
    expect(decryptResult1.success).toBe(true)
    expect(decryptResult1.value).toBe(data)
    
    const decryptResult2 = await client.decryptData(encryptResult2.value, key2)
    expect(decryptResult2.success).toBe(true)
    expect(decryptResult2.value).toBe(data)
  })
})

