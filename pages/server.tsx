import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Layout from '../components/layout'

import type { GetServerSidePropsContext } from 'next'
import type { Session } from 'next-auth'

export default function ServerSidePage(props: Record<string, unknown>) {
  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <Layout>
      <h1>Server Side Rendering</h1>
      <p>
        This page uses the <strong>unstable_getServerSession()</strong> method
        in <strong>getServerSideProps()</strong>.
      </p>
      <p>
        Using <strong>unstable_getServerSession()</strong> in{' '}
        <strong>getServerSideProps()</strong> is the recommended approach if you
        need to support Server Side Rendering with authentication.
      </p>
      <p>
        The advantage of Server Side Rendering is this page does not require
        client side JavaScript.
      </p>
      <p>
        The disadvantage of Server Side Rendering is that this page is slower to
        render.
      </p>
      <h2>Session Info:</h2>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  console.log({ session })

  return {
    props: { session }
  }
}
