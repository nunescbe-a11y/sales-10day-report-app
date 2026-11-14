import React from 'react';
import { LivingAuthPage } from './LivingAuthPage';

interface CloudflareLoginProps {
  onExploreLanding?: () => void;
  onEnterWorkspace?: () => void;
  isEmbedded?: boolean;
  onSuccess?: () => void;
}

export const CloudflareLogin: React.FC<CloudflareLoginProps> = ({
  onExploreLanding,
  onEnterWorkspace,
  onSuccess,
}) => {
  return (
    <LivingAuthPage
      onExploreLanding={onExploreLanding}
      onEnterWorkspace={onEnterWorkspace || onSuccess}
      onSuccess={onSuccess}
    />
  );
};
