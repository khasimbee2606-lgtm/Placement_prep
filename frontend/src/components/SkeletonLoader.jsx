import React from 'react';

/**
 * SkeletonLoader
 * Professional shimmer skeleton loading states for Dashboard, Charts, and Lists.
 */
export const StatCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-row justify-between mb-3">
      <div className="skeleton-line w-24 h-4"></div>
      <div className="skeleton-circle w-8 h-8"></div>
    </div>
    <div className="skeleton-line w-20 h-8 mb-2"></div>
    <div className="skeleton-line w-36 h-3"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="skeleton-card h-80">
    <div className="skeleton-row justify-between mb-4">
      <div className="skeleton-line w-40 h-5"></div>
      <div className="skeleton-line w-20 h-4"></div>
    </div>
    <div className="skeleton-block h-52"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="skeleton-table-row">
    <div className="skeleton-line w-1/3 h-4"></div>
    <div className="skeleton-line w-20 h-4"></div>
    <div className="skeleton-line w-16 h-4"></div>
    <div className="skeleton-line w-12 h-4"></div>
  </div>
);

export const HeatmapSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-row justify-between mb-3">
      <div className="skeleton-line w-48 h-5"></div>
      <div className="skeleton-line w-24 h-4"></div>
    </div>
    <div className="skeleton-block h-28"></div>
  </div>
);

export default {
  StatCardSkeleton,
  ChartSkeleton,
  TableRowSkeleton,
  HeatmapSkeleton,
};
