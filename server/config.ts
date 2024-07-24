const production = process.env.NODE_ENV === 'production'
const enableApplicationInsights = production

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  contentful: {
    enabled: get('CONTENTFUL_ENABLED', 'true'),
    accessToken: get('CONTENTFUL_ACCESS_TOKEN', ''),
    showPreview: get('CONTENTFUL_SHOW_PREVIEW', 'false'),
    previewToken: get('CONTENTFUL_PREVIEW_TOKEN', ''),
    spaceId: get('CONTENTFUL_SPACE_ID', ''),
    refreshSeconds: Number(get('CONTENTFUL_REFRESH_SECONDS', 30)),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 20)),
    inactivityMinutes: Number(get('WEB_SESSION_INACTIVITY_IN_MINUTES', 10)),
    appointmentsCacheMinutes: Number(get('APPOINTMENTS_CACHE_IN_MINUTES', 1)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 20000))),
      apiClientId: get('USER_API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('USER_API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    govukOneLogin: {
      url: get('GOVUK_ONE_LOGIN_URL', '', requiredInProduction),
      jwksUrl: get('GOVUK_ONE_LOGIN_JWKS_URL', '', requiredInProduction),
      homeUrl: get('GOVUK_ONE_LOGIN_HOME_URL', '', requiredInProduction),
      clientId: get('GOVUK_ONE_LOGIN_CLIENT_ID', 'clientId', requiredInProduction),
      privateKey: get('GOVUK_ONE_LOGIN_PRIVATE_KEY', 'privateKey', requiredInProduction),
      publicKey: get('GOVUK_ONE_LOGIN_PUBLIC_KEY', 'publicKey', requiredInProduction),
      timeout: Number(get('GOVUK_ONE_LOGIN_TIMEOUT_RESPONSE', 20000)),
      vtr: process.env.GOVUK_ONE_LOGIN_VTR === 'LOW' ? '["Cl"]' : '["Cl.Cm"]',
    },
    personOnProbationUserApi: {
      url: get('POP_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('POP_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('POP_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('PERSON_ON_PROBATION_USER_API_TIMEOUT_RESPONSE', 20000))),
      enabled: get('POP_API_ENABLED', 'true') === 'true',
    },
    resettlementPassportApi: {
      url: get('PSFR_API_URL', 'http://localhost:8080/resettlement-passport', requiredInProduction),
      timeout: {
        response: Number(get('PSFR_API_TIMEOUT_RESPONSE', 20000)),
        deadline: Number(get('PSFR_API_TIMEOUT_DEADLINE', 20000)),
      },
      agent: new AgentConfig(Number(get('PERSON_ON_PROBATION_USER_API_TIMEOUT_RESPONSE', 20000))),
      enabled: get('PSFR_API_ENABLED', 'true') === 'true',
    },
    zendesk: {
      url: get('ZENDESK_API_URL', 'http://localhost:8101', requiredInProduction),
      basicAuth: {
        user: get('ZENDESK_USER', requiredInProduction),
        pass: get('ZENDESK_TOKEN', requiredInProduction),
      },
      timeout: {
        response: Number(get('ZENDESK_API_TIMEOUT_RESPONSE', 30000)),
        deadline: Number(get('ZENDESK_API_TIMEOUT_DEADLINE', 30000)),
      },
      agent: new AgentConfig(),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  enableApplicationInsights,
  environmentName: get('ENVIRONMENT_NAME', ''),
  rateLimitPerMinute: Number(get('RATE_LIMIT_PER_MINUTE', 10)),
  s3: {
    featureFlag: {
      enabled: get('FEATURE_FLAG_ENABLED', 'true') === 'true',
      region: get('FEATURE_FLAG_AWS_REGION', 'eu-west-2'),
      bucketName: get('FEATURE_FLAG_BUCKET', 'hmpps-resettlement-passport-ui-config'),
      path: get('FEATURE_FLAG_PATH', 'feature-flags'),
      filename: get('FEATURE_FLAG_PATH_FILENAME', 'flags.json'),
    },
  },
  local: {
    featureFlag: {
      filename: get('LOCAL_FEATURE_FLAG_PATH_FILENAME', 'localstack/flags.json'),
    },
  },
}
