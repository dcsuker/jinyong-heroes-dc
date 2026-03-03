import { useGameStore } from './store/gameStore';
import MainMenuScreen from './screens/MainMenuScreen';
import WorldMapScreen from './screens/WorldMapScreen';
import TownScreen from './screens/TownScreen';
import BattleScreen from './screens/BattleScreen';
import DialogueScreen from './screens/DialogueScreen';
import CharacterScreen from './screens/CharacterScreen';
import InventoryScreen from './screens/InventoryScreen';
import SaveScreen from './screens/SaveScreen';
import QuestScreen from './screens/QuestScreen';

function App() {
  const screen = useGameStore((s) => s.screen);

  const renderScreen = () => {
    switch (screen) {
      case 'mainmenu':
        return <MainMenuScreen />;
      case 'worldmap':
        return <WorldMapScreen />;
      case 'town':
        return <TownScreen />;
      case 'battle':
        return <BattleScreen />;
      case 'dialogue':
        return <DialogueScreen />;
      case 'character':
        return <CharacterScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'save':
        return <SaveScreen />;
      case 'quest':
        return <QuestScreen />;
      default:
        return <MainMenuScreen />;
    }
  };

  return (
    <div className="w-screen h-screen bg-ink font-kai overflow-hidden select-none">
      {renderScreen()}
    </div>
  );
}

export default App;
