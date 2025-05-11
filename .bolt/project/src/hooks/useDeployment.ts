import { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/projectStore';

interface DeploymentConfig {
  platform: 'netlify' | 'vercel';
  autoDeploy: boolean;
  apiKey: string;
}

export const useDeployment = (config: DeploymentConfig) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDeploymentStatus } = useProjectStore();

  const fetchDeploymentStatus = async () => {
    try {
      const response = await fetch(`/api/deployments/${config.platform}/status`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch deployment status');

      const status = await response.json();
      setDeploymentStatus({
        lastDeployed: status.lastDeployed,
        platform: config.platform,
        url: status.url,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deployment status');
    }
  };

  const deploy = async () => {
    setIsDeploying(true);
    setError(null);

    try {
      const response = await fetch(`/api/deployments/${config.platform}/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (!response.ok) throw new Error('Deployment failed');

      const result = await response.json();
      setDeploymentStatus({
        lastDeployed: new Date().toISOString(),
        platform: config.platform,
        url: result.url,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  // Poll for deployment status every 5 minutes
  useEffect(() => {
    fetchDeploymentStatus();
    const interval = setInterval(fetchDeploymentStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.platform, config.apiKey]);

  // Auto-deploy on save if enabled
  useEffect(() => {
    if (config.autoDeploy) {
      const handleSave = () => {
        deploy();
      };

      window.addEventListener('save', handleSave);
      return () => window.removeEventListener('save', handleSave);
    }
  }, [config.autoDeploy]);

  return {
    isDeploying,
    error,
    deploy,
    fetchDeploymentStatus,
  };
}; 