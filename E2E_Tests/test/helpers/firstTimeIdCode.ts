// @ts-nocheck
import fs from 'fs'

export const getDobArray = '24-10-1982'.split('-')

export const getFirstTimeIdCode = async () => {
  try {
    const data = fs.readFileSync('./otp.txt', 'utf8')
    return data
  } catch (err) {
    console.error(err)
  }
  return ''
}
