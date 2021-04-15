import Link from 'next/link'
import Layout from '../components/layout'

export default function About() {
    return (
        <Layout>
            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>
        </Layout>
    )
}