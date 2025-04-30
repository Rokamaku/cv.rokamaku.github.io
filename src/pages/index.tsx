import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
// import Image from 'next/image'
import styles from '../styles/Home.module.css';
import { Cv, CvData } from '../app/cv';
import MyCvData from '../../public/resume.json';
import { FaFilePdf } from 'react-icons/fa';

const Home: NextPage = () => {
  const { basics }: CvData = MyCvData;

  return (
    <div className={styles.container}>
      <Head>
        <title>{`${basics.name} - ${basics.label} Resume`} </title>
        <meta name="description" content="Anh Bui CV" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a
          style={{ marginLeft: 'auto' }}
          target="_blank"
          rel="noopener noreferrer"
          href={basics.cvPdf}
        >
          {/* <img width="36px" style={{ float: 'right' }} src="icons8-export-pdf-48.png" alt="Export to Pdf" /> */}
          <FaFilePdf size={30} />
        </a>
        <Cv data={MyCvData} />
      </main>
    </div>
  );
};

export default Home;
