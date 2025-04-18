/**
 * Format a blockchain address to a readable format
 * @param address Full address string
 * @returns Shortened address with ellipsis in the middle
 */
export const formatAddress = (address: string): string => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };
  
  /**
   * Format a balance value to human-readable format
   * @param balance Balance value
   * @param decimals Decimal places (default: 12 for DOT)
   * @returns Formatted balance string
   */
  export const formatBalance = (balance: string | number, decimals: number = 12): string => {
    if (!balance) return '0';
    
    const numeric = typeof balance === 'string' ? parseFloat(balance) : balance;
    const divisor = Math.pow(10, decimals);
    const value = numeric / divisor;
    
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };