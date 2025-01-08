'use client'

import { useEffect } from 'react'
import styles from './image-modal.module.css'

export default function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <img src={image} alt="Utility Bill" className={styles.modalImage} />
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  )
}

