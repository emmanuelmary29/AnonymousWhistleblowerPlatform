import { describe, it, expect, beforeEach } from 'vitest'
import { mockNet } from './mocks'

describe('whistleblower-platform', () => {
  let client: any
  
  beforeEach(() => {
    client = mockNet.createClient()
  })
  
  it('submits whistleblower information successfully', async () => {
    const encryptedContent = '0x' + '00'.repeat(1024)
    const conditions = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
    
    const result = await client.submitWhistleblowerInfo(encryptedContent, conditions)
    expect(result.success).toBe(true)
    expect(typeof result.value).toBe('number')
  })
  
  it('adds and removes authorized parties', async () => {
    const party = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    let result = await client.addAuthorizedParty(party)
    expect(result.success).toBe(true)
    
    result = await client.isPartyAuthorized(party)
    expect(result.success).toBe(true)
    expect(result.value).toBe(true)
    
    result = await client.removeAuthorizedParty(party)
    expect(result.success).toBe(true)
    
    result = await client.isPartyAuthorized(party)
    expect(result.success).toBe(true)
    expect(result.value).toBe(false)
  })
  
  it('reveals submission when authorized', async () => {
    const encryptedContent = '0x' + '00'.repeat(1024)
    const conditions = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
    
    const submitResult = await client.submitWhistleblowerInfo(encryptedContent, conditions)
    expect(submitResult.success).toBe(true)
    
    const revealResult = await client.revealSubmission(submitResult.value)
    expect(revealResult.success).toBe(true)
    
    const getResult = await client.getSubmission(submitResult.value)
    expect(getResult.success).toBe(true)
    expect(getResult.value.revealed).toBe(true)
  })
  
  it('gets submission after revealing', async () => {
    const encryptedContent = '0x' + '00'.repeat(1024)
    const conditions = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
    
    const submitResult = await client.submitWhistleblowerInfo(encryptedContent, conditions)
    expect(submitResult.success).toBe(true)
    
    const revealResult = await client.revealSubmission(submitResult.value)
    expect(revealResult.success).toBe(true)
    
    const getResult = await client.getSubmission(submitResult.value)
    expect(getResult.success).toBe(true)
    expect(getResult.value.revealed).toBe(true)
    expect(getResult.value['encrypted-content']).toBe(encryptedContent)
    expect(getResult.value.conditions).toEqual(conditions)
  })
  
  it('gets submission before revealing', async () => {
    const encryptedContent = '0x' + '00'.repeat(1024)
    const conditions = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
    
    const submitResult = await client.submitWhistleblowerInfo(encryptedContent, conditions)
    expect(submitResult.success).toBe(true)
    
    const getResult = await client.getSubmission(submitResult.value)
    expect(getResult.success).toBe(true)
    expect(getResult.value.revealed).toBe(false)
    expect(getResult.value['encrypted-content']).toBe(encryptedContent)
    expect(getResult.value.conditions).toEqual(conditions)
  })
})

