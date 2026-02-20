import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainMenuScreen from './screens/MainMenuScreen'
import WorldMapScreen from './screens/WorldMapScreen'
import TownScreen from './screens/TownScreen'
import BattleScreen from './screens/BattleScreen'
import CharacterScreen from './screens/CharacterScreen'
import InventoryScreen from './screens/InventoryScreen'
import SettingsScreen from './screens/SettingsScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenuScreen />} />
        <Route path="/world" element={<WorldMapScreen />} />
        <Route path="/town/:townId" element={<TownScreen />} />
        <Route path="/battle/:battleId" element={<BattleScreen />} />
        <Route path="/character" element={<CharacterScreen />} />
        <Route path="/inventory" element={<InventoryScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
