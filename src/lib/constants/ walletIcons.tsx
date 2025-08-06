import { WalletIcon } from '@prisma/client';
import {
  FaWallet,
  FaUniversity,
  FaMoneyBillWave,
  FaPiggyBank,
  FaCreditCard,
  FaPaypal,
} from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';
import { RiSafe3Fill } from 'react-icons/ri';
import { PiSirenFill } from 'react-icons/pi';
import { SiPayoneer, SiRevolut, SiWise } from 'react-icons/si';

export const walletIconMap: Record<WalletIcon, React.JSX.Element> = {
  WALLET: <FaWallet />,
  BANK: <FaUniversity />,
  CASH: <FaMoneyBillWave />,
  SAFE: <RiSafe3Fill />,
  CARD: <FaCreditCard />,
  PAYPAL: <FaPaypal />,
  WISE: <SiWise />,
  PAYONEER: <SiPayoneer />,
  REVOLUT: <SiRevolut />,
  PIGGYBANK: <FaPiggyBank />,
  INVESTMENT: <MdTrendingUp />,
  EMERGENCY: <PiSirenFill />,
};
