import { useCallback, useState } from 'react'
import { useNavigate } from "react-router-dom";

import Fallingflowers from './component/Fallingflowers.jsx'
import StageManager from './component/stagemanager.jsx'
import Stage1wellcome from './component/Stage1wellcome.jsx'
import Stage2 from './component/Stage2.jsx'
import Stage3 from './component/Stage3.jsx'
import Stage4 from './component/Stage4.jsx'
import Stage5 from './component/Stage5.jsx'

const stages = [
  Stage1wellcome,
  Stage2,
  Stage3,
  Stage4,
  Stage5,
]

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