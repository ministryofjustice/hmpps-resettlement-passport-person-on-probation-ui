import { Given, setDefaultTimeout, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { pageFixture } from '../../hooks/pageFixtures'
import HomePage from '../../pageObjects/homePage'

setDefaultTimeout(20000)
let homePage: HomePage

Given('the user visit plan your future', async function () {
  homePage = new HomePage(pageFixture.page)
  await pageFixture.page.goto(process.env.BASEURL)
  homePage.shouldFindTitle()
})
Then('they should see the start page', async function () {
  await homePage.clickStart()
})
