import React, { useCallback, useState } from 'react'
import { useNavigate } from "react-router-dom";
import FallingFlowers from './component/Fallingflowers.jsx'
import StageManager from './component/stagemanager.jsx'
import Stage1wellcome from './component/Stage1wellcome.jsx'
import Stage2 from './component/Stage2.jsx'
import Stage3 from './component/Stage3.jsx'
import Stage4 from './component/Stage4.jsx'

const stages = [
  Stage1wellcome,
  Stage2,
  Stage3,
  Stage4,
]

export default function Home() {
  const [, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  // Fires after Stage4's Continue button → StageManager advances past last stage
  const handleAllComplete = useCallback(() => {
    navigate('/envelope')
  }, [navigate])

  const handleStageChange = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  return (
    <div className="home-wrapper">
      <FallingFlowers count={30} />
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