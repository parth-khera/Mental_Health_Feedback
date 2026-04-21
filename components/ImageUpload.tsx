'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

interface Props {
  onFile: (file: File | null) => void
}

export default function ImageUpload({ onFile }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error,   setError]   = useState('')

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    setError('')
    if (rejected.length) { setError('File too large or invalid type. Max 5 MB, images only.'); return }
    const file = accepted[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onFile(null)
  }

  return (
    <div className="space-y-2">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`relative rounded-2xl cursor-pointer overflow-hidden
            transition-all duration-300 ease-spring
            ${isDragActive
              ? 'border-2 border-sage-400 bg-sage-50 scale-[1.01]'
              : 'border-2 border-dashed border-gray-200 hover:border-sage-300 hover:bg-sage-50/40'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragActive ? 'bg-sage-100 scale-110' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 transition-colors duration-300 ${isDragActive ? 'text-sage-500' : 'text-gray-400'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium transition-colors duration-200 ${isDragActive ? 'text-sage-600' : 'text-gray-600'}`}>
                {isDragActive ? 'Release to upload' : 'Drop an image here'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">or <span className="text-sage-500 font-medium">browse files</span> · PNG, JPG, WEBP up to 5 MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-medium animate-in group">
          <Image src={preview} alt="Preview" width={600} height={300} className="w-full h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <button
            type="button"
            onClick={remove}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-medium
              hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sage-500" />
            <span className="text-xs font-medium text-gray-700">Image attached</span>
          </div>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5 animate-in">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
