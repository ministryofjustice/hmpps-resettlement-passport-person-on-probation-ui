import type { ContactHelpdeskForm } from '../data/zendeskData'
import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'

export type ZendeskTicket = {
  ticket: {
    id?: number
    subject: string
    comment: {
      body: string
    }
    tags: string[]
    requester: {
      email?: string
      name?: string
    }
  }
}

export default class ZendeskService {
  restClient: RestClient

  constructor() {
    this.restClient = new RestClient('ZenDesk API Client', config.apis.zendesk)
  }

  async createSupportTicket(contactHelpdeskForm: ContactHelpdeskForm): Promise<number> {
    try {
      const isProd = process.env.NODE_ENV === 'production'

      const messageBody = `
      Overall, how satisfied were you with this Service?: ${contactHelpdeskForm.score}
      Is there anything you want to tell us about using this Service?: ${contactHelpdeskForm.detail}

      Name: ${contactHelpdeskForm.name}
      Email: ${contactHelpdeskForm.email}
      `
      const requestBody: ZendeskTicket = {
        ticket: {
          subject: `${isProd ? '' : 'TEST '}Plan your future feedback`,
          comment: {
            body: messageBody,
          },
          tags: ['PlanYourFuture'],
          requester: {
            ...(contactHelpdeskForm.email ? { email: `${contactHelpdeskForm.email}` } : {}),
            ...(contactHelpdeskForm.name ? { name: `${contactHelpdeskForm.name}` } : {}),
          },
        },
      }
      const basicAuth = Buffer.from(
        `${config.apis.zendesk.basicAuth.user}/token:${config.apis.zendesk.basicAuth.pass}`,
      ).toString('base64')
      const response = (await this.restClient.externalPost({
        path: `/api/v2/tickets`,
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
        data: requestBody,
      })) as ZendeskTicket
      return response.ticket.id
    } catch (error) {
      logger.error('Error calling Zendesk REST API', error)
      throw new Error('Error creating Zendesk support ticket')
    }
  }
}
