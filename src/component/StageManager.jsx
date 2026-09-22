import { useState, useEffect, useCallback } from 'react'

export default function StageManager({ stages, onAllComplete, onStageChange }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    onStageChange && onStageChange(index)
  }, [index, onStageChange])

  const handleComplete = useCallback(() => {
    setIndex((i) => i + 1)
  }, [])

  useEffect(() => {
    if (index >= stages.length) {
      onAllComplete && onAllComplete()
    }
  }, [index, stages.length, onAllComplete])

  const CurrentStage = stages[index]
  if (!CurrentStage) return null

  return (
    <div className="stage-box">
      <CurrentStage onComplete={handleComplete} stageIndex={index} />
      <style>{`
        .stage-box {
          position: relative;
          z-index: 1;
          width: min(90vw, 480px);
          min-height: 320px;
          background: rgba(15, 15, 15, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 32px;
          backdrop-filter: blur(8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
          color: #fff;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}