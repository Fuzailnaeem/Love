import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from "react-router-dom";

import Fallingflowers from './component/Fallingflowers.jsx'
import Stage1wellcome from './component/Stage1wellcome.jsx'
import Stage2 from './component/Stage2.jsx'
import Stage4 from './component/Stage4.jsx'

const stages = [
  Stage1wellcome,
  Stage2,
  Stage4,
]

export function StageManager({ stages, onAllComplete, onStageChange }) {
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

export default function Home() {
  const [, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const handleAllComplete = useCallback(() => {
    navigate('/envelope')
  }, [navigate])

  const handleStageChange = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  return (
    <div className="home-wrapper">
      <Fallingflowers count={30} />

      <StageManager
        stages={stages}
        onAllComplete={handleAllComplete}
        onStageChange={handleStageChange}
      />

      <style>{`
        .home-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #000;
        }
      `}</style>
    </div>
  )
}