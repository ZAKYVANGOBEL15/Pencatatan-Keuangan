/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  ReceiptText,
  Tv,
  Heart,
  PiggyBank,
  HelpCircle,
  Briefcase,
  TrendingUp,
  Coins,
  Gift,
  Plus,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export default function CategoryIcon({ name, ...props }: CategoryIconProps) {
  switch (name) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'ReceiptText':
      return <ReceiptText {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'PiggyBank':
      return <PiggyBank {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Plus':
      return <Plus {...props} />;
    case 'HelpCircle':
    default:
      return <HelpCircle {...props} />;
  }
}
