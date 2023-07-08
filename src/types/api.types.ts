export interface BalanceResponse {
  retCode: number;
  retMsg: string;
  result: {
    list: {
      accountType: string;
      accountIMRate: string;
      accountMMRate: string;
      totalEquity: string;
      totalWalletBalance: string;
      totalMarginBalance: string;
      totalAvailableBalance: string;
      totalPerpUPL: string;
      totalInitialMargin: string;
      totalMaintenanceMargin: string;
      accountLTV: string;
      coin: {
        coin: string;
        equity: string;
        usdValue: string;
        walletBalance: string;
        borrowAmount: string;
        availableToBorrow: string;
        availableToWithdraw: string;
        accruedInterest: string;
        totalOrderIM: string;
        totalPositionIM: string;
        totalPositionMM: string;
        unrealisedPnl: string;
        cumRealisedPnl: string;
      }[];
    }[];
  };
  retExtInfo: Record<string, any>;
  time: number;
}
