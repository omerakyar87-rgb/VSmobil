'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, ExternalLink } from 'lucide-react'

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // APK dosyası URL'si - gerçek APK'nız olduğunda buraya ekleyin
  // Vercel Blob veya başka bir CDN URL'si olabilir
  const APK_URL = '/vsmobil.apk' 
  
  // Alternatif: Google Drive, Dropbox veya doğrudan link
  // const APK_URL = 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID'

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      return /android/i.test(userAgent.toLowerCase())
    }
    setIsMobile(checkMobile())

    const dismissed = localStorage.getItem('vsmobil-banner-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('vsmobil-banner-dismissed', 'true')
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Check if APK exists
      const response = await fetch(APK_URL, { method: 'HEAD' })
      
      if (response.ok) {
        // APK exists - download it
        if (isMobile) {
          window.location.href = APK_URL
        } else {
          const link = document.createElement('a')
          link.href = APK_URL
          link.download = 'vsmobil.apk'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // APK not found - show modal
        setShowModal(true)
      }
    } catch {
      // Network error or file not found - show modal
      setShowModal(true)
    }
    
    setIsDownloading(false)
  }

  if (!isVisible) return null

  return (
    <>
      <div className="bg-[#0066b8] text-white text-sm flex items-center justify-between px-3 py-2 min-h-[36px]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          
          <p className="text-xs sm:text-sm truncate">
            <span className="font-medium">VSMobil Uygulaması.</span>
            <span className="hidden sm:inline"> Her yerde, her zaman kod yazın.</span>
          </p>
          
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Kontrol ediliyor...' : 'VSMobil İndir'}</span>
          </button>
        </div>
        
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded transition-colors ml-2 shrink-0"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg max-w-md w-full p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0066b8] rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">VSMobil Uygulaması</h3>
                <p className="text-sm text-gray-400">Yakında Geliyor</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              VSMobil Android uygulaması yakında yayınlanacak! Şimdilik web sürümünü kullanmaya devam edebilirsiniz.
            </p>
            
            <div className="bg-[#2d2d2d] rounded p-3 mb-4">
              <p className="text-xs text-gray-400 mb-2">Geliştirici notu:</p>
              <p className="text-xs text-gray-300">
                APK dosyanızı <code className="bg-[#3c3c3c] px-1 rounded">public/vsmobil.apk</code> konumuna ekleyin veya APK_URL değişkenini güncelleyin.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] px-4 py-2 rounded text-sm transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex-1 bg-[#0066b8] hover:bg-[#0077cc] px-4 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Web Sürümü
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
