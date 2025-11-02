import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadSectionProps {
  uploadedFile: File | null
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onRemoveFile: () => void
  onStartAnalysis: () => void
  isAnalyzing: boolean
}

export function FileUploadSection({
  uploadedFile,
  onFileUpload,
  onDragOver,
  onDrop,
  onRemoveFile,
  onStartAnalysis,
  isAnalyzing
}: FileUploadSectionProps) {
  return (
    <>
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 max-w-xl mx-auto bg-white/50 backdrop-blur-sm shadow-sm"
      >
        <input type="file" accept=".html,.txt,.xml,.pdf" onChange={onFileUpload} className="hidden" id="file-input" />
        <label htmlFor="file-input" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
              <Upload className="h-7 w-7 text-blue-600" />
            </div>
            <p className="text-foreground font-medium">
              Drop your document here or{" "}
              <span className="text-blue-600 hover:text-blue-700 font-semibold">browse</span>
            </p>
            <p className="text-xs text-foreground/50">
              Supported formats: HTML, TXT, XML, PDF
            </p>
            {uploadedFile && (
              <div className="flex items-center gap-3 mt-2 px-4 py-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">{uploadedFile.name}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRemoveFile()
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </label>
      </div>

      <div className="flex justify-center mt-3 mb-8">
        <Button
          onClick={onStartAnalysis}
          disabled={!uploadedFile || isAnalyzing}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {isAnalyzing ? "Analyzing" : "Start Analysis"}
        </Button>
      </div>
    </>
  )
}
