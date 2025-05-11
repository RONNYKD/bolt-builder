import React from 'react';
import { useProjectStore } from '../stores/projectStore';
import { Clock, Globe, User } from 'lucide-react';

export const DeploymentStatus: React.FC = () => {
  const { projectName, deploymentStatus, ownership } = useProjectStore();

  const formatTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return 'Never deployed';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / (24 * 60))}d ago`;
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900">{projectName || 'Untitled Project'}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Deployment Status */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <div className="text-sm">
            <div className="text-gray-900">
              {deploymentStatus.platform ? (
                <>
                  Deployed to{' '}
                  <span className="font-medium">
                    {deploymentStatus.platform === 'netlify' ? 'Netlify' : 'Vercel'}
                  </span>
                </>
              ) : (
                'Not deployed'
              )}
            </div>
            <div className="text-gray-500">
              <Clock className="w-3 h-3 inline mr-1" />
              {formatTimeAgo(deploymentStatus.lastDeployed)}
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <div className="text-sm">
            <div className="text-gray-900">
              {ownership.type === 'personal' ? 'Personal' : 'Team'} Project
            </div>
            <div className="text-gray-500">{ownership.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 