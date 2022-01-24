import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>prize-watch-admin</title>
        <meta name="description" content="prize-watch-admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          プライズウォッチ開発者ツール
        </h1>
      </main>

      <footer className={styles.footer}>
        <small>©️METORO</small>
      </footer>
    </div>
  )
}

export default Home
