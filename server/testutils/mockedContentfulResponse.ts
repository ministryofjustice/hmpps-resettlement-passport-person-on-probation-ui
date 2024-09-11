export const mockedPage = {
  metadata: {},
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: 'p38k4c668chw' } },
    type: 'Entry',
    id: '5MsCwkncEfro7CS8hsjxN6',
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'componentDuplex' } },
    revision: 1,
    createdAt: '2024-06-17T15:40:29.350Z',
    updatedAt: '2024-06-17T15:41:39.007Z',
    environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
    locale: 'en-GB',
  },
  fields: {
    bodyText: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'This is a secure and confidential service for people on probation in England and Wales after leaving prison.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [{ data: {}, marks: [], value: 'Use this service to:', nodeType: 'text' }],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  // @ts-expect-error not sure why it complains about this line
                  content: [{ data: {}, marks: [], value: 'view your licence conditions', nodeType: 'text' }],
                  nodeType: 'paragraph',
                },
              ],
              nodeType: 'list-item',
            },
            {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    { data: {}, marks: [], value: 'check your upcoming meetings and appointments', nodeType: 'text' },
                  ],
                  nodeType: 'paragraph',
                },
              ],
              nodeType: 'list-item',
            },
          ],
          nodeType: 'unordered-list',
        },
        {
          data: {},
          content: [
            { data: {}, marks: [], value: '', nodeType: 'text' },
            {
              data: {
                target: {
                  metadata: { tags: [] },
                  sys: {
                    space: { sys: { type: 'Link', linkType: 'Space', id: 'p38k4c668chw' } },
                    type: 'Entry',
                    id: '1RwR1RGevyc3NeOD3zgQ3X',
                    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'componentHeroBanner' } },
                    revision: 3,
                    createdAt: '2024-06-17T08:55:52.584Z',
                    updatedAt: '2024-06-18T10:53:26.384Z',
                    environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
                    locale: 'en-GB',
                  },
                  fields: {
                    internalName: 'Start',
                    text: 'Sign in',
                    icon: 'govuk-button__start-icon',
                    link: '/overview',
                    qatag: 'start-btn',
                  },
                },
              },
              content: [],
              nodeType: 'embedded-entry-inline',
            },
            { data: {}, marks: [], value: '', nodeType: 'text' },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [{ data: {}, marks: [], value: 'Before you start', nodeType: 'text' }],
          nodeType: 'heading-2',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'This service uses GOV.UK One Login. You’ll be able to create a GOV.UK One Login if you do not already have one.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            { data: {}, marks: [], value: "You'll need a mobile phone to receive security codes.", nodeType: 'text' },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'For your privacy and security you will be signed out automatically after 60 minutes.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [{ data: {}, marks: [], value: 'First time users', nodeType: 'text' }],
          nodeType: 'heading-3',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                "You'll enter the First-time ID code from page 1 in the black pack you were given when you left prison.",
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value:
                'If you do not have a First-time ID code, or it has expired, your probation officer can provide a new one.',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
        {
          data: {},
          content: [
            { data: {}, marks: [{ type: 'bold' }], value: '', nodeType: 'text' },
            {
              data: {
                target: {
                  metadata: {},
                  sys: {
                    space: { sys: { type: 'Link', linkType: 'Space', id: 'p38k4c668chw' } },
                    type: 'Entry',
                    id: '2xQ8ZbcBMcFun2NFjZhue0',
                    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'warning' } },
                    revision: 1,
                    createdAt: '2024-06-17T15:39:49.354Z',
                    updatedAt: '2024-06-17T15:39:59.617Z',
                    environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
                    locale: 'en-GB',
                  },
                  fields: { text: 'Only use this service if your licence conditions allow you to use the internet.' },
                },
              },
              nodeType: 'embedded-entry-inline',
            },
            { data: {}, marks: [], value: '', nodeType: 'text' },
          ],
          nodeType: 'paragraph',
        },
        { data: {}, content: [{ data: {}, marks: [], value: '\n', nodeType: 'text' }], nodeType: 'paragraph' },
      ],
      nodeType: 'document',
    },
    title: 'Page1',
    slug: 'page1',
  },
}
export const mockedResponse = {
  sys: { type: 'Array' },
  total: 1,
  skip: 0,
  limit: 100,
  items: [
    {
      metadata: {},
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'spaceid-123' } },
        type: 'Entry',
        id: 'abc',
        contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'page' } },
        revision: 6,
        createdAt: '',
        updatedAt: '',
        environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
        locale: 'en-GB',
      },
      fields: {
        internalName: 'Navigation',
        section: [
          {
            metadata: {},
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: 'spaceid-123' } },
              type: 'Entry',
              id: '1',
              contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'componentDuplex' } },
              revision: 16,
              createdAt: '',
              updatedAt: '',
              environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
              locale: 'en-GB',
            },
            ...mockedPage,
          },
        ],
      },
    },
  ],
  includes: {},
}

export const mockedPageResponse = {
  sys: { type: 'Array' },
  total: 1,
  skip: 0,
  limit: 100,
  items: [{ metadata: {}, sys: {}, fields: { ...mockedPage.fields } }],
}
