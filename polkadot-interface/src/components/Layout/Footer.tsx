import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-polkadot-dark text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            <p>© {new Date().getFullYear()} PolkadotJS Interface</p>
          </div>
          <div className="mt-2 md:mt-0">
            <a 
              href="https://github.com/MandalaChain/substrate-dev-template" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-polkadot-primary transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
