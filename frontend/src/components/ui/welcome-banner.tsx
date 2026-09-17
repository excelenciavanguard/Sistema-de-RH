'use client';

import { ArrowRight, SunMedium } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type WelcomeBannerProps = {
  onShowActions?: () => void;
  description?: ReactNode;
};

export default function WelcomeBanner({ onShowActions, description }: WelcomeBannerProps) {
  return (
    <Card className="alpha-welcome-banner relative mb-5 overflow-hidden border-none text-white">
      <CardContent className="alpha-welcome-content relative z-10">
        <span className="alpha-welcome-symbol" aria-hidden="true"><SunMedium /></span>
        <div className="alpha-welcome-copy">
          <h2>Olá, Ramon!</h2>
          <p>{description ?? <>Você tem <strong>27 currículos para revisar</strong> e <strong>3 requisições aguardando decisão</strong> hoje.</>}</p>
        </div>
        <p className="alpha-welcome-message">Pessoas bem cuidadas constroem grandes resultados.</p>
        {onShowActions && <button type="button" onClick={onShowActions} className={cn(buttonVariants({ variant: 'outline' }), 'alpha-welcome-action')}>
          Ver todas as ações <ArrowRight />
        </button>}
      </CardContent>
    </Card>
  );
}
