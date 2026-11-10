import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import { Cv, CvData } from '../app/cv';
import MyCvData from '../../public/resume.json';
import { FaFilePdf } from 'react-icons/fa';
import ThemeToggle from '../app/components/ThemeToggle';

const Home: NextPage = () => {
  const { basics }: CvData = MyCvData;
  const title = `${basics.name} – ${basics.label} | Resume`;
  const description = `${basics.name}, ${basics.label}. ${
    basics.summary?.split('. ')[0] ?? ''
  }`.trim();

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        {basics.url && <meta property="og:url" content={basics.url} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={basics.cvPdf}
            className={styles.pdfLink}
          >
            <FaFilePdf size={18} aria-hidden />
            <span>Download PDF</span>
          </a>
        </div>
        <Cv data={MyCvData} />
      </div>
    </div>
  );
};

export default Home;
