interface AnalystCommentaryProps {
  commentary: string
}

export default function AnalystCommentary({ commentary }: AnalystCommentaryProps) {
  if (!commentary) return null
  
  return (
    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
      <h5 className="font-semibold text-indigo-900 mb-2">Analyst Commentary</h5>
      <p className="text-sm text-indigo-800 leading-relaxed">
        {commentary}
      </p>
    </div>
  )
}
