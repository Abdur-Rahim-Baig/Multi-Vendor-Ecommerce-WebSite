/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

const graphqlOptions = REST_OPTIONS(config)

export const OPTIONS = (request: Request) =>
	graphqlOptions(request, {
		params: Promise.resolve({ slug: ['graphql'] }),
	})
