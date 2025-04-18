import React from 'react';

interface HeaderProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const Header: React.FC<HeaderProps> = ({ connectionStatus }) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="bg-polkadot-dark text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <svg width="30" height="30" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M256 0C114.6 0 0 114.6 0 256C0 397.4 114.6 512 256 512C397.4 512 512 397.4 512 256C512 114.6 397.4 0 256 0Z" fill="#E6007A"/>
              <path d="M256 64C238.3 64 224 78.3 224 96C224 113.7 238.3 128 256 128C273.7 128 288 113.7 288 96C288 78.3 273.7 64 256 64Z" fill="white"/>
              <path d="M256 192C238.3 192 224 206.3 224 224C224 241.7 238.3 256 256 256C273.7 256 288 241.7 288 224C288 206.3 273.7 192 256 192Z" fill="white"/>
              <path d="M256 320C238.3 320 224 334.3 224 352C224 369.7 238.3 384 256 384C273.7 384 288 369.7 288 352C288 334.3 273.7 320 256 320Z" fill="white"/>
              <path d="M160 128C142.3 128 128 142.3 128 160C128 177.7 142.3 192 160 192C177.7 192 192 177.7 192 160C192 142.3 177.7 128 160 128Z" fill="white"/>
              <path d="M160 256C142.3 256 128 270.3 128 288C128 305.7 142.3 320 160 320C177.7 320 192 305.7 192 288C192 270.3 177.7 256 160 256Z" fill="white"/>
              <path d="M352 128C334.3 128 320 142.3 320 160C320 177.7 334.3 192 352 192C369.7 192 384 177.7 384 160C384 142.3 369.7 128 352 128Z" fill="white"/>
              <path d="M352 256C334.3 256 320 270.3 320 288C320 305.7 334.3 320 352 320C369.7 320 384 305.7 384 288C384 270.3 369.7 256 352 256Z" fill="white"/>
            </svg>
            <h1 className="ml-2 text-xl font-bold">PolkadotJS Interface</h1>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
          <span className="text-sm">{getStatusText()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;