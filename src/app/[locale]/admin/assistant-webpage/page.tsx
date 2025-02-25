'use client';

import React from 'react';
import styles from './shared/page.module.css'; // use simple styles for demonstration purposes
import Chat from '@/components/Chat/Chat';

const Home = () => {
  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        <div className={styles.chat}>
          <Chat />
        </div>
      </div>
    </main>
  );
};

export default Home;
